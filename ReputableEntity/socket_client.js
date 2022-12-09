// require web socket
const WebSocket = require('ws').WebSocket;

function createClient(serverHostOrIp, manager) {
    let client = new WebSocket.WebSocket(serverHostOrIp);

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });
    
    client.on('message', function(message) {
        manager.messageHandler.handle(message);
    });

    client.on('close', function() {
        console.log('\tConnection closed with server ' + serverHostOrIp);
    });
    

    client.on('error', function(error) {
        console.log("ERROR: Connection with " + serverHostOrIp + " closed.");
        manager.closeClient(serverHostOrIp)
    });
    return client;


}

module.exports = createClient