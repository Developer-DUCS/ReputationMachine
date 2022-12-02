// require web socket
const WebSocket = require('ws').WebSocket;


function createClient(clientHostOrIp) {
    let client = new WebSocket.WebSocket(clientHostOrIp);

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });
    
    client.on('connect', function(connection) {
        console.log('Client connected to ' + clientHostOrIp);

        connection.on('error', function(error) {
            console.log("\x1b[31m%s\x1b[0m","Connection Error: " + error.toString());
        });

        connection.on('close', function() {
            console.log('Client Connection Closed');
        });

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            }
        });
    });

    //client.connect(clientHostOrIp);
    return client;
}

module.exports = createClient