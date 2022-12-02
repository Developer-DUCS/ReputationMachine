const createSocketServer = require('./ReputableEntity/socket_server');
const createClient = require('./ReputableEntity/socket_client');
const initCommandLine  = require('./ReputableEntity/serverCommands');
const express = require('express');

let myClients = [];

if (process.argv[2] == undefined) {
    PORT = 8080;
}
else {
    PORT = parseInt(process.argv[2])
}
sockServ = createSocketServer(PORT);

console.log("WebSocket server listening on port", PORT);

initCommandLine(myClients);