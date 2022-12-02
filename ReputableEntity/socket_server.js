const { Server } = require('ws');

function createServer(port) {
   // create websocket server
   const sockserver = new Server({ port: port });

   // when a new connection is spawned, configure the call backs for that connection
   sockserver.on('connection', (ws) => {
      console.log('New client connected!');
      
      ws.on('close', () => console.log('Client has disconnected!'));

      ws.on('message', function(msg){
         console.log(msg.toString());
      });
   });

   return sockserver;
}

module.exports = createServer;