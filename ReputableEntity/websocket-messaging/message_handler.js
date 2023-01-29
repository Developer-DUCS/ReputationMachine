// File: message_handler.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: This file exports the MessageHandler class. This class defines how
// to handle message as they are passed through the network. 
// METHODS:
//  handle(jsonMessage) - Process the given message
//  sendReceipt(jsonMessage) - Interprets the message as a SendReceipt message and distributes
//      sends the receipt to the appropriate peer(s)
//  requestReceipt(jsonMessage) - Interprets the message as a RequestReceipt message and
//      asks all peers for receipts that match the criteria
//  checkMessage(jsonMessage) - Verify that the message is properly formatted

const checkMessage = require('./message_checker')
const Cache = require('./data_cache')

class MessageHandler {
    /** 
    * @param {number} messageRetentionTime - The maximum number of messages to be stored in the cache
    * @param {number} maxNumMessagesRetained - The maximum amount of time to hold messages in the cache, in milliseconds
    * @param {number} maxReceiptRetentionTime - The maximum number of reputation receipts to be stored in the cache
    * @param {number} maxNumReceiptsRetained - The maximum amount of time to hold reputation receipts in the cache, in milliseconds
    */
    constructor(messageRetentionTime, maxNumMessagesRetained, maxReceiptRetentionTime, maxNumReceiptsRetained) {
        this.messageCache = new Cache(messageRetentionTime, maxNumMessagesRetained);
        this.receiptCache = new Cache(maxReceiptRetentionTime, maxNumReceiptsRetained)
    }

    handle(jsonMessage) {
        console.log("Received " + jsonMessage);

        if (!checkMessage(jsonMessage)){
            throw new Error("Invalid message recieved");
        }

        let msgID = jsonMessage['Header']['MsgID'];

        if(this.messageCache.isCached(msgID)){
            throw new Error("Message already handled");
        }

        this.messageCache.cache(msgID);

        if (jsonMessage.Header.MsgType === 'ShareReceipt') {
            shareReceipt(jsonMessage);
        }
        else if (jsonMessage.Header.MsgType === 'ReceiveReceipt') {
            receiveReceipt(jsonMessage);
        }
    }

    #shareReceipt(jsonMessage) {
        console.log('shareReceipt');
    }

    #requestReceipt(jsonMessage) {
        console.log('ReceiveReceipt');
    }
}

module.exports = MessageHandler;