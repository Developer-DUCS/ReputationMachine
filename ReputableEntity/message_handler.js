// Some of this code is AI generated
// ~20 lines
class MessageHandler {
    constructor() {
        this.recentRequests = [];
    }

    handle() {
        console.log("Handled");
        if (this.jsonMessage.Header.MsgType === 'SendReceipt') {
            SendReceipt(this.jsonMessage);
        }
        else if (this.jsonMessage.Header.MsgType === 'ReceiveReceipt') {
            ReceiveReceipt(this.jsonMessage);
        }
    }

    SendReceipt() {
        console.log('SendReceipt');
    }

    ReceiveReceipt() {
        console.log('ReceiveReceipt');
    }

    CheckReceipt(rcpt){
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