// File: server_commands.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Define the commands that can be sent to the server while it is running. 
// Myst provide a ClientManager web socket server to properly process commands.
 
const os = require("os");
const { send } = require("process");
const createClient = require('./websocket-messaging/socket_client');

function initCommands(manager, websocketServer, iniConfig) {
    process.stdin.setEncoding("utf8");

    process.stdin.on("readable", function() {
        const chunk = String(process.stdin.read());

        chunk.split(os.EOL).forEach(str => {
            // break the line into its arguments
            let args = str.split(" ");

            parseCommand(args, websocketServer, manager, iniConfig);
        });

        process.stdin.resume();
    });
}

function parseCommand(args, websocketServer, manager, iniConfig){
    // the first argument is the command
    let cmd = args[0].toLowerCase();

    switch(cmd){
        case "peer":
            peer(args, manager);
            break;

        case "show":
            show(args, manager);
            break;

        case "close":
            close(args, manager);
            break;

        case "send":
            sendCommand(args, websocketServer, manager);
            break;

        case "reconnect":
            reconnect(args, manager, iniConfig);
            break;

        // when a command is run, a blank command is detected. Eat that error here
        case "":
            break;

        // throw an error if there is an unrecognized command
        default:
            console.error("\x1b[31m%s\x1b[0m", 'ERROR: command not recognized for command "' + str + '"');
    }
}

// print an error message to the console
function printErrorMessage(message){
    console.error("\x1b[31m%s\x1b[0m", "ERROR: " + message);
}

// PEER command
// Description: Open a new websocket connection to a new websocket server and add it
// to the list of client connections
// Syntax: peer <new ws url>
//      <new ws url> = the url for the websocket to connect to
function peer(args, manager){
    console.log("\tConnecting to " + args[1]);
    try{
        manager.addClient(args[1]);
    } catch (error) {
        printErrorMessage("Error connecting to new peer " + args[1]);
    }
}

// SHOW CLIENTS command
// Description: shows the host of all websocket client connections
// Syntax: show clients
function show(args, manager){
    if (args[1] != "clients"){
        printErrorMessage("Invalid show command for target " + args[1]);
        return;
    }

    if (manager.getNumClients() == 0){
        console.log("\tNO CLIENTS")
    }
    else{
        manager.getClients().forEach(client => {
            console.log("\t"+client);
        });
    }
    return;
}

// CLOSE command
// close a connection to a peer
// Syntax: CLOSE <CLIENT or SERVER> <target url>
//      <client or server> say if it is a client or server connection to close
//      <target url> the url of the target to close
function close(args, manager) {
    if (args[1] == undefined || args[1].toLowerCase() != "client"){
        console.error("\x1b[31m%s\x1b[0m", "ERROR: Invalid close command for target type " + args[1]);
        return;
    }
    try {
        let target = args[2];
        manager.closeClient(target);
        return;
    } catch (e){
        printErrorMessage(e.message);
    }
}

// SEND command 
// send a message from all clients to the server they are connected to 
// Note, when parsing the message, everything after the <source> will be part of the message, and all
// whitespace will be replaced by a space
// Syntax: send {(from <source> <message>) | (test <message type>)}
//      <source> = "clients" "server" or "all"
//      <message> = message to be sent
//      <message type> = The message type you want to test. Either "ShareReceipt" or "RequestReceipt"
function sendCommand(args, websocketServer, manager){
    if (args[1] == undefined || args[2] == undefined) {

    }
    else if (args[1].toLowerCase() == "from"){
        let src = args[2].toLowerCase();
        let numArgs = args.length
        let msg = "";

        args.slice(3,numArgs).forEach((msgPiece) => {
            msg += msgPiece + " ";
        });


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

    else if (args[1].toLowerCase() == "test") {
        if (args[2].toLowerCase() == "sharereceipt") {
            console.log("\tSending message from server to all connected nodes.")
            websocketServer.clients.forEach(client => {
                client.send(msg);
            });
            manager.send(msg);
        }
        else if (args[2].toLowerCase() == "requestreceipt") {
            console.log("\tSending message from server to all connected nodes.")
            websocketServer.clients.forEach(client => {
                client.send(msg);
            });
            manager.send(msg);
        }
    }

    else {
        printErrorMessage("Invalid syntax for SEND command")
    }
}

// RECCONECT Command
// Drop all connections and spawn connections from the loaded config file
// Syntax: reconnect
function reconnect(args, manager, iniConfig){
    // close all connections
    manager.getClients().forEach(url => {
        try{
            manager.closeClient(url);
        } catch (e){
            printErrorMessage(e.message)
        }
    });

    // spawn initial connections from config file
    iniConfig.Peers.DefaultPeers.forEach(url => {
        try{
            manager.addClient(url);
        } catch(e) {
            printErrorMessage(e.message)
        }
    });
}
module.exports = initCommands;
