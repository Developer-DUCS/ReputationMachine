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

// Some of this code is AI generated
// ~20 lines
class MessageHandler {
    constructor() {
        this.recentRequests = [];
    }

    handle(jsonMessage) {
        console.log("Received " + jsonMessage);
        if (jsonMessage.Header.MsgType === 'SendReceipt') {
            SendReceipt(jsonMessage);
        }
        else if (jsonMessage.Header.MsgType === 'ReceiveReceipt') {
            ReceiveReceipt(jsonMessage);
        }
    }

    SendReceipt(jsonMessage) {
        console.log('SendReceipt');
    }

    RequestReceipt(jsonMessage) {
        console.log('ReceiveReceipt');
    }

    checkMessage(rcpt){
        if (rcpt.hasOwnProperty('Header') && rcpt.hasOwnProperty('Body')) {
            console.log('Receipt has both Header and Body');
            return false
        }
        else {
            console.log('json is missing Header or Body');
            return true
        }
    }
}

module.exports = MessageHandler;