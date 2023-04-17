// File: createShareReceiptMessage.js
// Author: Julian Fisher
// Date: 3/7/2023
// Description: Define a function that will create a ShareReceipt message 

const {v4: uuidv4} = require('uuid');

function createShareReceiptMessage(TTL, receipt, TXID, SrcPubKey) {
    let message = {
        "Header": {
            "MsgType": "ShareReceipt",
            "TTL": TTL,
            "MsgID": uuidv4()
        },
        "Body": {
            "Receipt": receipt,
            "TXID": TXID,
            "SrcPubKey": SrcPubKey
        }
    }
    return message;
}

module.exports = createShareReceiptMessage;