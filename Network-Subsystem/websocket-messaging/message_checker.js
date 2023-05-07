// File: test_message_handler.js
// Author: Julian Fisher / chatGPT
// Date: 1/21/2023
// Description: This file exports the checkMessage function that will check a json object to ensure
// that it is a valid message sent from peering reputation machine servers

const acceptableRequestReceiptCriteria = ["TXID","Src","Trgt","RcptType","TimeFrame"]
const { json } = require('body-parser');
const checkRcpt = require('../check_receipt')

function checkMessage(jsonObj){
    console.log("CHECKING")
    console.log(jsonObj)
    // an error is thrown if it tries to parse something that is not a json object. Return false
    // if it is not a json object
    try{
        if (jsonObj.hasOwnProperty("Header") && jsonObj.hasOwnProperty("Body")) {
            let header = jsonObj["Header"];
            let body = jsonObj["Body"];

            if (!checkHeader(header)){return false;}
            switch (header["MsgType"]) {
                case "ShareReceipt":
                    console.log("SHARE")
                    return checkShareRcptMsg(body)
                case "RequestReceipt":
                    console.log("REQUEST")
                    return checkReqRcptMsg(body);
                case "RequestResponse":
                    console.log("RESPONSE")
                    return checkReqRcptRes(body);
                default:
                    return false;
            }
        }
        return false;
    } catch {
        return false;
    }
}

// this vast majority of this function and the accompanying comments were generated by chatGPT, only minor edits have been made form the 
// ai generated code
function checkHeader(jsonObj) {
    // check if json object has "MsgType", "TTL", "SrcIPorHost" and "MsgID" properties 
    if (jsonObj.hasOwnProperty("MsgType") && jsonObj.hasOwnProperty("TTL") &&  jsonObj.hasOwnProperty("MsgID")) {
        // check if "MsgType" is "ShareReceipt", "TTL" is number, "SrcIPorHost" is string and "MsgID" is string
        if (typeof jsonObj["MsgType"] === "string" && typeof jsonObj["TTL"] === "number" && typeof jsonObj["MsgID"] === "string") {
            return true;
        }
    }
    return false;
}

// parts of this function and the accompanying comments were generated by chatGPT
function checkShareRcptMsg(jsonObj) {
    // check if json object has "Receipt", "TXID" and "Fingerprint" properties
    if (jsonObj.hasOwnProperty("Receipt") && typeof jsonObj["Receipt"] === "object") {
        return checkRcpt(jsonObj["Receipt"]);
    }
    return false;
}

// parts of this function and the accompanying comments were generated by chatGPT, 
function checkReqRcptMsg(jsonObj) {
    // check if json object has ReqParams
    if (jsonObj.hasOwnProperty("ReqParams") && typeof jsonObj.ReqParams == "object") {
        // check if req params has proper source
        if (jsonObj.ReqParams.hasOwnProperty("source") && typeof jsonObj.ReqParams.source == "string") {
            return true;
        }
        // check if req params has proper target
        if (jsonObj.ReqParams.hasOwnProperty("target") && typeof jsonObj.ReqParams.target == "string") {
            return true;
        }
    }
    return false;
}

// this entire function and the accompanying comments were generated by chatGPT
function checkReqRcptRes(jsonObj) {
    // check if json object has "Results" and "RequestMessageID" properties
    if (jsonObj.hasOwnProperty("Receipts") && jsonObj.hasOwnProperty("ReqID")) {
        // check if "Results" is an array and "RequestMessageID" is a string
        if (Array.isArray(jsonObj.Receipts) && typeof jsonObj.ReqID === "string") {
            // check if all elements of the array are json objects
            for (let i = 0; i < jsonObj.Receipts.length; i++) {
                if (typeof jsonObj.Receipts[i] !== "object") {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}



// this entire function and the accompanying comments are ai generated
function checkCriteria(jsonObj, propertyList) {
    // Loop through the propertyList
    for (let i = 0; i < propertyList.length; i++) {
        // Check if the json object has at least one of the properties in the propertyList
        if (jsonObj.hasOwnProperty(propertyList[i])) {
            // Loop through the keys in the json object
            for (let key in jsonObj) {
                // Check if all keys in the json object are in the propertyList
                if (!propertyList.includes(key)) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}

module.exports = checkMessage;