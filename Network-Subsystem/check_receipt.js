// File: check_receipt.js
// Author: Julian Fisher
// Date: 1/25/2023
// Description: Check a json object to be sure that it is a properly formatted
// reputation receipt.
// © Drury University 2023

// some of this code is AI generated
// ~ 11 lines

const { type } = require("os");

const validClaimTypes = ["Creation","Modification","Deletion"]
const validCategoryTypes = ["Review","Rating"]

// parts of this function is written by chatGPT
function checkJsonFormat(jsonObj) {
    // check if json object has "source", "target" and "claim" properties
    if (jsonObj.hasOwnProperty("source") && jsonObj.hasOwnProperty("target") && jsonObj.hasOwnProperty("claim")) {
        // check if "source" and "target" are strings, and "claim" is a valid claim
        if (typeof jsonObj.source === "string" && typeof jsonObj.target === "string" && typeof jsonObj._id === "string" && typeof jsonObj.fingerprint === "string" && checkClaim(jsonObj.claim)) {//check if _id and fingerprint are present and are strings
            return true;
        }
    }
    return false;
}

// check a claim to make sure it is formatted properly
function checkClaim(claim) {
    if (typeof claim != "object"){return false;}

    // check if json object has "id", "type", "category" and "content" properties
    if (claim.hasOwnProperty("id") && claim.hasOwnProperty("type") && claim.hasOwnProperty("category") && claim.hasOwnProperty("content")) {
        
        // deletion has a slightly different format, check here
        if (claim.type == "Deletion"){

            // check if "id" and "type" are strings while "category" and "content" are undefined
            if (typeof claim.id === "string" && typeof claim.type === "string" && claim.category === undefined && claim.content === undefined) {
                return true;
            }
        }
        else {
            // check if "id", "type", "category", and "content" are strings
            if (typeof claim.id === "string" && typeof claim.type === "string" && typeof claim.category === "string" && typeof claim.content === "string") {
                
                // check if claim and category have valid values
                if (validCategoryTypes.includes(claim.category) && validClaimTypes.includes(claim.type)){
                    return true;
                }
            }
        }
    }
    return false;
}

module.exports = checkJsonFormat;