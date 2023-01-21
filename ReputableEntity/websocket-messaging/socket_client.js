const WebSocket = require('ws').WebSocket;
const standardLib = require('../standard_lib')

function createClient(serverHostOrIp, manager) {
    let client = new WebSocket.WebSocket(serverHostOrIp);

    client.on('connectFailed', function(error) {
        standardLib.printErrorMessage('Connect Error: ' + error.toString());
    });
    
    client.on('message', function(message) {
        manager.messageHandler.handle(message);
    });

    client.on('close', function() {
        console.log('\tConnection closed with server ' + serverHostOrIp);
    });
    

    client.on('error', function(error) {
        standardLib.printErrorMessage("Closing connection with client " + serverHostOrIp + ".");
        manager.closeClient(serverHostOrIp)
    });
    return client;
}

module.exports = createClient