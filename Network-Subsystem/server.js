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

// Check if a config file was provided, if so, load that config, if not, use the default config file
if (process.argv[2] == undefined) {
    config = ini.parse(fs.readFileSync('./config.ini','utf-8'))
}
else {
    config = ini.parse(fs.readFileSync(process.argv[2],'utf-8'))
}

const port = config.ServerConfig.Port
const cacheRetentionTime = config.ServerConfig.CacheTime
const cacheMaxSize = config.ServerConfig.CacheMaxSize
const dbConn = config.ServerConfig.DBConnectionString
const msgPrctSave = config.ServerConfig.PercentReceiptsSave

// create database connection
let db = new Database(String(dbConn))

let connMan = new ConnectionHandler(cacheRetentionTime,cacheMaxSize,cacheRetentionTime,cacheMaxSize, port, msgPrctSave, db);
initCommandLine(connMan.clientManager,connMan.sockServ,config);


console.log("WebSocket server listening on port", port);

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