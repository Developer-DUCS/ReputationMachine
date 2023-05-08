// File: createGetReceiptMessage.js
// Author: Julian Fisher
// Date: 3/7/2023
// Description: Define a function that will create a ShareReceipt message 

const {v4: uuidv4} = require('uuid');

function createShareResMessage(TTL, reqParams) {
    let message = {
        "Header": {
            "MsgType": "RequestReceipt",
            "TTL": TTL,
            "MsgID": uuidv4()
        },
        "Body": {
            "ReqParams": reqParams
        }
    }
    return message;
}

module.exports = createShareResMessage;