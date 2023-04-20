// File: createShareReceiptMessage.js
// Author: Julian Fisher
// Date: 3/7/2023
// Description: Define a function that will create a ShareReceipt message 

const {v4: uuidv4} = require('uuid');

function createShareReceiptMessage(TTL, receipt, txid, fingerprint) {
    let message = {
        "Header": {
            "MsgType": "ShareReceipt",
            "TTL": TTL,
            "MsgID": uuidv4()
        },
        "Body": {
            "Receipt": receipt,
            "TXID": txid,
            "Fingerprint": fingerprint
        }
    }
    return message;
}

module.exports = createShareReceiptMessage;