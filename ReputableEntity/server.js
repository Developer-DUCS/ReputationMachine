// File: server.js
// Author: Julian Fisher
// Date: 11/13/2022

const express = require("express");
const bodyParser = require("body-parser");
const { route } = require("./receipt-sharing-api/writeReceipt.js");

// application constants
const PORT = 5000;

// create the http app
const app = express();

// add a router
const router = express.Router();

// make a database connection
const db = require("./database.js");

app.use(express.static("public"));

// create receipt sharing routes
router.use("/writeReceipt",require("./receipt-sharing-api/writeReceipt.js"));
router.use("/receipt",require("./receipt-sharing-api/getReceipt.js"));
router.use("/publishReceipt",require("./receipt-sharing-api/publishReceipt.js"));
router.use("/verifyReceipt",require("./receipt-sharing-api/verifyReceipt.js"));

// create blockchain routes
router.use("/receiptHash",require("./blockchain-api/getReceiptHash.js"));
router.use("/writeReceiptHash",require("./blockchain-api/writeReceiptHash.js"));

app.use(router);

app.listen(PORT, (err) => {
    if (err)
        console.log("server startup failed");
    else
        console.log(`Server listening on port ${PORT}`);
});