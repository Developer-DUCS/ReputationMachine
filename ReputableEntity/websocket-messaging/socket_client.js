// require web socket
const WebSocket = require('ws').WebSocket;

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

// print an error message to the console
function printErrorMessage(message){
    console.error("\x1b[31m%s\x1b[0m", "ERROR: " + message);
}

module.exports = createClient