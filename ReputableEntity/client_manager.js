// File: client_manager.js
// Author: Julian Fisher
// Date: 12/6/2022
// Description: 
// This file defines a clientManager class that is used to create and track
// websocket client connections to remote servers

// This code was partially generate the openAI chat bot found at chat.openai.com
// ~20 lines of code

const createClient = require('./socket_client');

class ClientManager {
    constructor() {
      this.sockets = [];
    }

    addClient(url) {
      let socket = createClient(url);
      this.sockets.push(socket);
      return socket;
    }

    closeClient(url) {
      let socket = this.sockets.find(socket => socket.url === url);
      if (socket) {
        socket.close();
        this.sockets = this.sockets.filter(socket => socket.url !== url);
      }
    }

    messageClients(msg) {
        this.sockets.forEach((sock) => {
            sock.send(msg);
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