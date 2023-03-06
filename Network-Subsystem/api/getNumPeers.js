// File: getPeers.js
// Author: Julian Fisher
// Date: 3/5/2023
// Description: Define a function that will return the peers for a socket
// server and a client manager

function getNumPeers(sockServer, clientManager, source="all") {
    let clientList = []
    if (clientManager.getNumClients() != 0){
        clientManager.getClientURLs().forEach(client => {
            clientList.push(client);
        });
    }

    let serverList = []
    sockServer.clients.forEach(clientConn => {
        serverList.push(clientConn._socket.server._connectionKey);
    });

    numClients = clientList.length;
    numServer = serverList.length;
    return({
        'serverConnections': numServer,
        'clientConnections': numClients,
        'total': numClients + numServer
    })
}

module.exports = getPeers;