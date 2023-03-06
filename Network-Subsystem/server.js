// File: server.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Initialize the server to handle sending and recieving websocket messages

const initCommandLine  = require('./server_commands');
const express = require('express');
const ConnectionHandler = require('./websocket-messaging/connection_manager')
const ini = require('ini')
const fs = require('fs')
const Database = require('./db')
const app = express();

// Check if a config file was provided, if so, load that config, if not, use the default config file
if (process.argv[2] == undefined) {
    config = ini.parse(fs.readFileSync('./config.ini','utf-8'))
}
else {
    config = ini.parse(fs.readFileSync(process.argv[2],'utf-8'))
}

const wsPort = config.ServerConfig.NodeCommunicationPort
const apiPort = config.ServerConfig.APIPort
const cacheRetentionTime = config.ServerConfig.CacheTime
const cacheMaxSize = config.ServerConfig.CacheMaxSize
const dbConn = config.ServerConfig.DBConnectionString
const msgPrctSave = config.ServerConfig.PercentReceiptsSave


// create database connection
let db = new Database(String(dbConn))

let connMan = new ConnectionHandler(cacheRetentionTime,cacheMaxSize,cacheRetentionTime,cacheMaxSize, wsPort, msgPrctSave, db);
console.log("WebSocket server listening on port", wsPort);

initCommandLine(connMan.clientManager,connMan.sockServ,config);

let getPeers = require('./api/getNumPeers');


// define API routes
app.get("/getNumPeers", (req, res) => {
    try {
        res.json(getPeers(connMan.sockServ,connMan.clientManager));
        res.status(200);
        res.send()
    }
    catch (e) {
        res.status(500);
        res.send();
    }
});


// 
app.listen(apiPort, () => {
    console.log("API listening on port",apiPort);
});

if (config.Peers.DefaultPeers != undefined){
    // spawn initial connections from config file
    config.Peers.DefaultPeers.forEach(url => {
        connMan.clientManager.addClient(url);
    });
}

setInterval(() => {
    console.log("Refreshing Cache");
    connMan.refreshCache();
}, config.ServerConfig.CacheRefresh)