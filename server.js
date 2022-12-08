const createSocketServer = require('./ReputableEntity/socket_server');
const initCommandLine  = require('./ReputableEntity/serverCommands');
const ClientManager = require('./ReputableEntity/client_manager')
const express = require('express');

if (process.argv[2] == undefined) {
    PORT = 8080;
}
else {
    PORT = parseInt(process.argv[2])
}


sockServ = createSocketServer(PORT);
clients = new ClientManager()
console.log("WebSocket server listening on port", PORT);

initCommandLine(clients,sockServ);