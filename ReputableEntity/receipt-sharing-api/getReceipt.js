// File: getReceipt.js
// Author: Julian Fisher
// Date: 11/13/2022
//
// This file defines the API route to retrieve a receipt from the local 
// database, and query neighbors for receipts as well. 
// Resource         Req Verb    Description         Status Code
// /receipt         POST        Get receipts        200 (found receipts)
//                                                  404 (no receipts found)

const router = require("Express").Router();

router.post("/", function(req,res){
    let query = "SELECT * FROM Receipt;"
    
    db.all(query, params, (err,rows) => {
        if (err) {
            res.status(400).json({});
            return;
        }
        else {
            res.status(200).json({"data":rows});
        }
    });
});

module.exports = router;