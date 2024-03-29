// File: socket_server.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Create and return a new WebSocket server that listens on the given port
// and passes all messages to connectionManager
// © Drury University 2023

const { Server } = require('ws');

function createServer(port, connectionManager) {
   // create websocket server
   const sockserver = new Server({ port: port });

   // when a new connection is spawned, configure the call backs for that connection
   sockserver.on('connection', (ws, req) => {
      const ip = req.socket.remoteAddress;
      ws.on('close', () => console.log('Client ' + ws.url + ' has disconnected!'));

      ws.on('message', (msg) => {
         connectionManager.handleMessage(msg,ws);
      });
   });

   return sockserver;
}

module.exports = createServer;