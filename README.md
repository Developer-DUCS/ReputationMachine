# ReputationMachine

The ReputationMachine project is a capstone project at Drury University (2022-2023). The purpose of the Reputation Machine is to build a better [reputation system](https://en.wikipedia.org/wiki/Reputation_system#:~:text=Reputation%20systems%20are%20programs%20or,to%20build%20trust%20through%20reputation). When building a typical reputation system, all users must trust a central authority to manage and moderate the system. This means reputation systems are inherently vulnerable to being manipulated by those who run them. The goal of the Reputation Machine is to move this trust from a central authority into the technology that makes the system work. The Reputation Machine accomplishes this goal by using a distributed network to share reputation information as well as relying on blockchain technology to help verify the legitimacy of the information that is being shared.

## Starting the Server

Starting the server is a straightforward process. Simply clone this repo, and run `node server.js path/to/config.ini`. When starting the server you may, but do not have to, supply the path to a config file. If no config file path is specified, the default config file located at `./ReputationMachine/ReputableEntity/config.ini` is used.

## Config File Structure

The config file is an [ini file](https://en.wikipedia.org/wiki/INI_file) with the following structure:

```text
[Peers]
DefaultPeers[] = ws://url1.xyz
DefaultPeers[] = ws://url2.xyz
DefaultPeers[] = ws://url3.xyz
...

[ServerConfig]
Port = 8080
```

## Server Commands

When the server is running, you have the ability to send commands to the server by typing in the terminal. The available commands are as follows:

### PEER

**Syntax**: peer *URL*  
**Description**: The peer command opens a new WebSocket connection to the given URL. This is used to manually add a connection to another Reputation Machine node.

### CLOSE

**Syntax**: close [client|server] *URL*  
**Description**: Manually close a connection to a node you are connected. You may specify if this node is the client or server role in the WebSocket connection. However, that is optional. If neither client nor server is specified, any connection with the givern URL will be closed.

### SHOW

**Syntax**: show [client|server] connections  
**Description**: Shows connections to other nodes. You may specify if this node is the client or server role in the websocket connection. However, that is optional. If neither client nor server is specified, all connections are listed.

### SEND

**Syntax**: send from {client|server|all} *MESSAGE*  
**Description**: Send a message from your server to nodes you are peered with. You must specify if you want the message to be sent from this node's clients, server, or both.
