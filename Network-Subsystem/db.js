// File: db.js
// Author: Julian Fisher
// Date: 01/11/2023
// Description: Make a connection with the MongoDB

const mongoose =  require('mongoose')
const receiptSchema = require('./models/receipts')
const ini = require('ini')

class Database {
    constructor(configFile) {
        mongoose.connect(configFile.ServerConfig.DBConnectionString);
        this.conn = mongoose.connection;
        this.conn.once('open', () => {
            console.log("MongoDB connected successfully")
        })

        this.receipt = mongoose.model('Receipt', receiptSchema)
    }

    saveReceipt (rcpt){
        this.receipt.save(rcpt);
    }


    
}

module.exports = Database