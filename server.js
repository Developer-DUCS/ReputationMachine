// File: server.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Initialize the server to handle sending and recieving websocket messages

const createSocketServer = require('./ReputableEntity/websocket-messaging/socket_server');
const initCommandLine  = require('./ReputableEntity/server_commands');
const ClientManager = require('./ReputableEntity/websocket-messaging/client_manager')
const express = require('express');
const MessageHandler = require('./ReputableEntity/websocket-messaging/message_handler')
const ini = require('ini')
const fs = require('fs')

// Check if a config file was provided, if so, load that config, if not, use the default config file
if (process.argv[2] == undefined) {
    config = ini.parse(fs.readFileSync('./ReputableEntity/config.ini','utf-8'))
}
else {
    config = ini.parse(fs.readFileSync(process.argv[2],'utf-8'))
}

const PORT = config.ServerConfig.Port

const cacheRetentionTime = config.ServerConfig.CacheTime
const cacheMaxSize = config.ServerConfig.CacheMaxSize
messageHandler = new MessageHandler(cacheRetentionTime,cacheMaxSize,cacheRetentionTime,cacheMaxSize);

sockServ = createSocketServer(PORT, messageHandler);
clientManager = new ClientManager(messageHandler);

console.log("WebSocket server listening on port", PORT);

if (config.Peers.DefaultPeers != undefined){
    // spawn initial connections from config file
    config.Peers.DefaultPeers.forEach(url => {
        clientManager.addClient(url);
    });
}

initCommandLine(clientManager,sockServ,config);

setInterval(() => {
    console.log("Clearing cache");
    messageHandler.refreshCaches();
}, config.ServerConfig.CacheRefresh)