// File: server_commands.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Define the commands that can be sent to the server while it is running. 
// Myst provide a ClientManager web socket server to properly process commands.
 
const os = require("os");
const createClient = require('./socket_client');

function initCommands(manager, websocketServer, iniConfig) {
    process.stdin.setEncoding("utf8");

    process.stdin.on("readable", function() {
        const chunk = String(process.stdin.read());

        chunk.split(os.EOL).forEach(str => {
            // break the line into its arguments
            let args = str.split(" ");

            // the first argument is the command
            let cmd = args[0].toLowerCase();

            // PEER command
            // Description: Open a new websocket connection to a new websocket server and add it
            // to the list of client connections
            // Syntax: peer <new ws url>
            //      <new ws url> = the url for the websocket to connect to
            if (cmd == "peer") {
                console.log("\tConnecting to " + args[1]);
                try{
                    manager.addClient(args[1]);
                } catch (error) {
                    console.log("\t"+error);
                    console.error("\x1b[31m%s\x1b[0m", "ERROR: Error connecting to new peer " + args[1]);
                }
            }

            // SHOW CLIENTS command
            // Description: shows the host of all websocket client connections
            // Syntax: show clients
            else if (cmd == "show" && args[1] == "clients") {

                if (manager.getNumClients() == 0){
                    console.log("\tNO CLIENTS")
                }
                else{
                    manager.getClients().forEach(client => {
                        console.log("\t"+client);
                    });
                }
            }

            // CLOSE command
            // close a connection to a peer
            // Syntax: CLOSE <CLIENT or SERVER> <target url>
            //      <client or server> say if it is a client or server connection to close
            //      <target url> the url of the target to close
            else if (cmd == "close" && args[1] == "client") {
                let target = args[2];
                manager.closeClient(target);
            }

            // SEND command 
            // send a message from all clients to the server they are connected to 
            // Note, when parsing the message, everything after the <source> will be part of the message, and all
            // whitespace will be replaced by a space
            // Syntax: send from <source> <message>
            //      <source> = "clients" "server" or "all"
            //      <message> = message to be sent
            else if (cmd == "send") {
                if (args[1].toLowerCase() == "from"){
                    let src = args[2].toLowerCase();

                    let numArgs = args.length
                    let msg = "";

                    args.slice(3,numArgs).forEach((msgPiece) => {
                        msg += msgPiece + " ";
                    });

                    console.log(msg);

                    if (src == "clients") {
                        console.log("\tSending message from all clients.")
                        manager.messageClients(msg);
                    }
                    else if (src == "server") {
                        console.log("\tSending message from server to all connected clients.")
                        websocketServer.clients.forEach(client => {
                            client.send(msg);
                        });
                    }
                    else if (src == "all") {
                        console.log("\tSending message from server to all connected nodes.")
                        websocketServer.clients.forEach(client => {
                            client.send(msg);
                        });
                        manager.send(msg);
                    }
                }
                else {
                    console.error("\x1b[31m%s\x1b[0m", "ERROR: Invalid syntax for SEND command")
                }
            }

            // RECCONECT Command
            // Drop all connections and spawn connections from the loaded config file
            // Syntax: reconnect
            else if (cmd == "reconnect"){
                // close all connections
                manager.getClients().forEach(url => {
                    manager.closeClient(url);
                });

                // spawn initial connections from config file
                iniConfig.Peers.DefaultPeers.forEach(url => {
                    manager.addClient(url);
                });
            }

            // when a command is run, a blank command is detected. Eat that error here
            else if (cmd == ""){
                return;
            }
            // throw an error if there is an unrecognized command
            else {
                console.error("\x1b[31m%s\x1b[0m", 'ERROR: command not recognized for command "' + str + '"');
            }
        })

        process.stdin.resume();
    });
}

module.exports = initCommands;
