// File: socket_server.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Create and return a new WebSocket server that listens on the given port
// and passes all messages to messageHandler

const { Server } = require('ws');

function createServer(port, messageHandler) {
   // create websocket server
   const sockserver = new Server({ port: port });

   // when a new connection is spawned, configure the call backs for that connection
   sockserver.on('connection', (ws) => {
      console.log('New client connected!');
      
      ws.on('close', () => console.log('Client has disconnected!'));

      ws.on('message', function(msg){
         messageHandler.handle(msg);
      });
   });

   return sockserver;
}

module.exports = createServer;