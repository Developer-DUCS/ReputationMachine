// File: message_handler.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: This file exports the ConnectionManager class. This class defines how
// to handle message as they are passed through the network. As well as creating a websocket
// server to listen for incoming connections, and a client manger to make outbound websocket
// connection.
//
// METHODS:
//  handle(jsonMessage) - Process the given message
//  sendReceipt(jsonMessage) - Interprets the message as a SendReceipt message and distributes
//      sends the receipt to the appropriate peer(s)
//  requestReceipt(jsonMessage) - Interprets the message as a RequestReceipt message and
//      asks all peers for receipts that match the criteria
//  checkMessage(jsonMessage) - Verify that the message is properly formatted

const checkMessage = require('./message_checker');
const Cache = require('./data_cache');
const ClientManager = require('./client_manager');
const WsServer = require('./socket_server');
const printError = require('../printError');
const { json } = require('body-parser');
const {v4: uuidv4} = require('uuid');
const http = require('http');

const REQ_WAIT_TIME = 5000
class ConnectionManager {
    /** 
    * @param {number} messageRetentionTime - The maximum number of messages to be stored in the cache
    * @param {number} maxNumMessagesRetained - The maximum amount of time to hold messages in the cache, in milliseconds
    * @param {number} maxReceiptRetentionTime - The maximum number of reputation receipts to be stored in the cache
    * @param {number} maxNumReceiptsRetained - The maximum amount of time to hold reputation receipts in the cache, in milliseconds
    * @param {number} savePercent - The percentage of receipts to save as messages come through
    */
    constructor(messageRetentionTime, maxNumMessagesRetained, port, savePercent) {
        this.messageCache = new Cache(messageRetentionTime, maxNumMessagesRetained);
        this.sockServ = WsServer(port, this);
        this.clientManager = new ClientManager(this);
        this.prctSave = savePercent;
        this.pendingReqs = [];
    }

    async handleMessage(message, messageSource) {
        let jsonMessage;

        // try to parse the message, if you can't it's already a json object
        // this is needed because when a message is sent via the API it comes as an object
        // and if it comes from a websocket it comes in as a buffer
        try {
            jsonMessage = JSON.parse(message);
        } catch {
            jsonMessage = message
        }

        // If an improperly formatted json object is received, the check message function will
        // throw an error, catch it here.
        try {
            if (!checkMessage(jsonMessage)){
                printError("Invalid message recieved");
                return;
            }
        }
        catch {
            printError("Invalid message recieved");
            return;
        }
        
        let msgID = jsonMessage['Header']['MsgID'];
        console.log("Processing message "+msgID)

        if(this.messageCache.isCached(msgID)){
            console.log("Dropping message with ID '" + msgID + "': Message already recieved from another source")
            return;
        }

        this.messageCache.cache(msgID);

        if (jsonMessage.Header.MsgType === 'ShareReceipt') {
            this.shareReceipt(jsonMessage,messageSource);
        }
        else if (jsonMessage.Header.MsgType === 'RequestReceipt') {
            return await this.requestReceipt(jsonMessage, jsonMessage["Body"]["ReqParams"], messageSource);
        }
        return;
    }

    shareReceipt(jsonMessage, msgSrc) {
        // TODO:
        // Verify rcpt hash w/ blockchain

        if (Math.random() * 100 <= this.prctSave) {
            let data = JSON.stringify(jsonMessage["Body"]["Receipt"]);
            
            let options = {
                hostname: "127.0.0.1",
                port: 3030,
                path: '/saveReceipt',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': data.length
                }
            }
            
            const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)
            });
            
            req.on('error', error => {
                console.error(error);
            });
            req.write(data);
            req.end();

        }
        this.sendAllExcept(jsonMessage,msgSrc);
        return;
    }

    async requestReceipt(jsonMessage, reqParams, msgSrc) {
        console.log("1")
        return await this.requestReceiptCoreFunction(jsonMessage, reqParams, msgSrc).then(result => {
            return result;
        });
    }

    requestReceiptCoreFunction(jsonMessage, reqParams, msgSrc){
        // get the ID for our current request
        let currReqId = jsonMessage.Header.MsgID

        this.sendAllExcept(jsonMessage,msgSrc);        
        reqParams = JSON.stringify(reqParams);
        let found = []
        
        let options = {
            hostname: "127.0.0.1",
            port: 3030,
            path: '/retrReceipts',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': reqParams.length
            }
        }
        
        // make request to local database
        const req = http.request(options, res => {
            found.concat(res)
        });
        req.on('error', error => {
            console.error(error);
        });
        req.write(reqParams);
        req.end();

        this.pendingReqs.push({"ID": currReqId, "found": found})

        // send request response
        if (found.length > 0){
            resMessage = {
                Header: {
                    MsgType: "RequestResponse",
                    TTL: 10,
                    MsgID: uuidv4()
                },
                Body: {
                    ReqID: msgID,
                    Receipts: found
                }
            }

            this.sendAll(resMessage);
        }

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.pendingReqs.find(rcpt => rcpt.ID === currReqId));
            }, REQ_WAIT_TIME)
        });
    }

    reqResponse(jsonMessage, msgSrc){
        let msgID = jsonMessage["Body"]["ReqID"];
        let newReceipts = jsonMessage["Body"]["Receipts"];

        if (this.pendingReqs.includes(msgID)){
            let index = this.pendingReqs.findIndex((element) => {
                element.id == msgID;
            });
            
            let currElement = this.pendingReqs[index]
            this.pendingReqs[index] = {
                id: currElement.id,
                receipts: this.currElement.receipts.concat(newReceipts)
            }
        }
        else {
            this.sendAllExcept(jsonMessage, msgSrc);
        }
    }

    // share receipt with all peers except for the excepted URL
    sendAllExcept(msg, except){
        let messageBuff = Buffer.from(JSON.stringify(msg));

        // repeat message to other neighbors
        this.sockServ.clients.forEach(client => {
            if (client != except){
                client.send(messageBuff);
            }
        });

        this.clientManager.sockets.forEach(client => {
            if (client != except){
                client.send(messageBuff);
            }
        })
    }

    // send a message to all other neighbors
    sendAll(msg) {
        let messageBuff = Buffer.from(JSON.stringify(msg));
        // repeat message to other neighbors
        this.sockServ.clients.forEach(client => {
            client.send(messageBuff);
        });
        this.clientManager.sockets.forEach(client => {
            client.send(messageBuff);
        })
    }

    refreshCache(){
        this.messageCache.cleanCache();
    }
}

module.exports = ConnectionManager;