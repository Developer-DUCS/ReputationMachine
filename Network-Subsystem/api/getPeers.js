// File: getPeers.js
// Author: Julian Fisher
// Date: 3/7/2023
// Description: Define a function that will return the peers for a socket
// server and a client manager
// © Drury University 2023

function getPeers(sockServer, clientManager, source="all") {
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


    return({
        'serverConnections': serverList,
        'clientConnections': clientList,
        'all': serverList.concat(clientList)
    });
}

module.exports = getPeers;