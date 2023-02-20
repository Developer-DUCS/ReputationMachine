// File: client_manager.js
// Author: Julian Fisher
// Date: 12/6/2022
// Description: 
// This file defines a clientManager class that is used to create and track
// websocket client connections to remote servers
// METHODS:
// addClient(url) - Connect to a WebSocket server and add the client to the 
//    list of client connections
// closeClient(url) - Closes the connection to the server with the given URL
//    and removes the client from the list of clients
// messageClient(msg) - Sends a message to all clients that are currently connected
// getClients() - Returns a list of all client connection URLs
// getNumClients() - Returns the number of current client connections

// This code was partially generate the openAI chat bot found at chat.openai.com
// ~20 lines of code

const createClient = require('./socket_client');
const MessageHandler = require('./connection_manager')

class ClientManager {
    constructor(MsgHandler) {
      this.sockets = [];
      this.msgHandler = MsgHandler;
    }

    addClient(url) {
      let socket = createClient(url, this);
      this.sockets.push(socket);
      return socket;
    }

    closeClient(url) {
      let socket = this.sockets.find(socket => socket.url === url);
      if (socket) {
        socket.close();
        this.sockets = this.sockets.filter(socket => socket.url !== url);
      }
      else {
        throw new Error('ERROR: Client ' + url + ' not found.');
      }
    }

    send(msg) {
      this.sockets.forEach((sock) => {
        sock.send(msg);
      });
    }

    // Send a message to all clients, except for the client with the URL or IP
    // address provided in the except parameter
    sendExcept(msg, except){
      this.sockets.forEach((sock) => {
        if (sock.remoteAddress != except) {
          sock.send(msg).url;
        }
      });
    }

    getClients() {
        let clientURLs = []
        this.sockets.forEach((client) =>{
            clientURLs.push(client.url);
        });
        return clientURLs;
    }

    getNumClients(){
        return this.sockets.length;
    }
}

module.exports = ClientManager