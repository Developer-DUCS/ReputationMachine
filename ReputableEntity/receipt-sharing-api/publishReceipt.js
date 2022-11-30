// File: publishReceipt.js
// Author: Julian Fisher
// Date: 11/13/2022
//
// This file defines the API route to publish the receipt to the RE's
// neighbor nodes. It will save the receipt to the sqlite db and forward
// the request to it's neighbors. An RE will not share a receipt without
// verifying the receipt against the blockchain. 
// Resource         Req Verb    Description                     Status Code
// /publishReceipt  POST        Publish to neighbors and save   200 (receipt saved and shared)
//                                                              400 (receipt hashes do not match)

const router = require("Express").Router();

router.post("/", function(req,res){
    
});

module.exports = router;