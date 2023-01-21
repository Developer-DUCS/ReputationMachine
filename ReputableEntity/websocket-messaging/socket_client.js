// File: socket_client.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Create a new websocket client and return the client

const WebSocket = require('ws').WebSocket;
const printErrorMessage = require('../printError')

function createClient(serverHostOrIp, manager) {
    let client = new WebSocket.WebSocket(serverHostOrIp);

    client.on('connectFailed', function(error) {
        printErrorMessage('Connect Error: ' + error.toString());
    });
    
    client.on('message', function(message) {
        manager.messageHandler.handle(message);
    });

    client.on('close', function() {
        console.log('\tConnection closed with server ' + serverHostOrIp);
    });
    

    client.on('error', function(error) {
        printErrorMessage("Closing connection with client " + serverHostOrIp + ".");
        manager.closeClient(serverHostOrIp)
    });
    return client;
}

module.exports = createClient