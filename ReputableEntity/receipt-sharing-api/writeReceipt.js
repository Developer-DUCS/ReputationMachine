// File: writeReceipt.js
// Author: Julian Fisher
// Date: 11/13/2022
//
// This file defines the API route to write a receipt to the blockchaom
// and saves the receipt to the RE's local sqlite database 
// Resource         Req Verb    Description             Status Code
// /writeReceipt    POST        Save receipt to db      201 (saved)
//                                                      400 (invalid receipt structure)
//                                                      409 (cannot verify receipt)


const db = require("../database.js");
const bodyParser = require("body-parser")
const router = require("Express").Router();
router.use(bodyParser.json())

router.post("/", function(req,res){
    console.log(req.body);
    let query = `INSERT INTO Receipt (Receipt_Data) VALUES (\"${JSON.stringify(req.body.receipt)}\");`
    console.log(query);
    db.run(query, [], (err,rows) => {
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