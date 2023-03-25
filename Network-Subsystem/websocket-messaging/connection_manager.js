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

    handleMessage(message, messageSource) {
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
            requestReceipt(jsonMessage, msgID, messageSource);
        }
        return;
    }

    shareReceipt(jsonMessage, msgSrc) {
        // TODO:
        // Verify rcpt hash w/ blockchain
        
        if (Math.random() * 100 <= this.prctSave) {
            // TODO:
            // SAVE TO DB
            console.log("Saving to DB");
        }
        this.sendAllExcept(jsonMessage,msgSrc);
        return;
    }

    async requestReceipt(jsonMessage, msgID, msgSrc) {
        // check if req ID is pending, if so, do not process the request
        if (this.pendingReqs.includes(msgID)){
            return;
        }
        
        // TO DO:
        // Make db req API call 
        found = []

        if (found.length > 0){
            resMessage = {
                Header: {
                    MsgType: "RequestResponse",
                    TTL: 10,
                    MsgID: 
                }
            }
        }
        
        this.sendAllExcept(jsonMessage,msgSrc);

        //      Send response if rcpts are found
        console.log('ReceiveReceipt');
        this.sendAllExcept(jsonMessage,msgSrc);
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