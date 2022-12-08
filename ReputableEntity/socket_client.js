// require web socket
const WebSocket = require('ws').WebSocket;

function createClient(clientHostOrIp) {
    let client = new WebSocket.WebSocket(clientHostOrIp);

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });
    
    client.on('message', function(message) {
        console.log(message.toString())
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    client.on('close', function() {
        console.log('\tConnection closed with server ' + clientHostOrIp);
    });
    

    client.on('error', function(error) {
        console.log("ERROR TEST");
    });
    return client;


}

module.exports = createClient