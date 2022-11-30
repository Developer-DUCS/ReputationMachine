// File: verifyHash.js

const router = require("Express").Router();

router.post("/", function(req,res){
    res.status(200).json({"valid": true});
});

module.exports = router;