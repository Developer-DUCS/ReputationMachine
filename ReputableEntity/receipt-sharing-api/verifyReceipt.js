// File: verifyReceipt.js
// Author: Julian Fisher
// Date: 11/13/2022
//
// This file defines the API route to verify a receipt against the blockchain.
// This route will generate a hash of the receipt and check if it matches 
// what is saved to the blockchain. 
// Resource         Req Verb    Description             Status Code
// /verifyReceipt   POST        Verify w/ blockchain    200 (valid receipt)
//                                                      400 (hashes do not match)
//                                                      404 (no hash foun on blockchain)

const router = require("Express").Router();

router.post("/", function(req,res){
    
});

module.exports = router;