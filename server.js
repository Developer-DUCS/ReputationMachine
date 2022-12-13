const createSocketServer = require('./ReputableEntity/socket_server');
const initCommandLine  = require('./ReputableEntity/server_commands');
const ClientManager = require('./ReputableEntity/client_manager')
const express = require('express');
const MessageHandler = require('./ReputableEntity/message_handler')
const ini = require('ini')
const fs = require('fs')

if (process.argv[2] == undefined) {
    config = ini.parse(fs.readFileSync('./ReputableEntity/config.ini','utf-8'))
}
else {
    config = ini.parse(fs.readFileSync(process.argv[2],'utf-8'))
}

const PORT = config.ServerConfig.Port

console.log("WebSocket server listening on port", PORT);

messageHandler = new MessageHandler();
sockServ = createSocketServer(PORT, messageHandler);
clients = new ClientManager();

if (config.Peers.DefaultPeers != undefined){
    // spawn initial connections from config file
    config.Peers.DefaultPeers.forEach(url => {
        clients.addClient(url);
    });
}

initCommandLine(clients,sockServ,config);