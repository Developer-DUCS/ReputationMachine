// File: databse.js
// Author: Julian Fisher
// Date: 11/13/2022
//
// This file creates the database connection and will initialize the
// sqlite database if it has not been initialized.
// 
// This code is heavily based on code from https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
const sqlite3 = require('sqlite');
var md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, function(err) {
    if (err) {
        console.error(err.message);
        throw err;
    }
    else {
        console.log('Connected to the SQLite databse.');
        db.run('CREATE TABLE Receipt (Receipt_Data);', (err) => {
            if (err) {
                console.log("");
            }
            else {
                console.log("'Receipt' table did not exist and has been created.");
                // Insert rows into table
                db.run("CREATE ROWS QUERY");
            }
        })
    }
})

module.exports = db;