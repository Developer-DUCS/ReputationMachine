// File: verifyHash.js

const router = require("Express").Router();

router.post("/", function(req,res){
    res.status(200).json({"txid": "12344test1234"});
});

module.exports = router;