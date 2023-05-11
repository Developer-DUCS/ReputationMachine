# ReputationMachine

The ReputationMachine project is a capstone project at Drury University (2022-2023). The purpose of the Reputation Machine is to make a system that facilitates making better [reputation system](https://en.wikipedia.org/wiki/Reputation_system#:~:text=Reputation%20systems%20are%20programs%20or,to%20build%20trust%20through%20reputation). When building a typical reputation system, all users must trust a central authority to manage and moderate the system. This means reputation systems are inherently vulnerable to being manipulated by those who run them. The goal of the Reputation Machine is to move this trust from a central authority into the technology that makes the system work. The Reputation Machine accomplishes this goal by using a distributed network to share reputation information as well as relying on blockchain technology to help verify the legitimacy of the information that is being shared.

## Starting the Reputation Machine

Starting the Reputation Machine requires running several process. The Reputation Machine consists of several sub systems that all must be running. The following need to be running to have a node of the reputation machine function properly.

1. Run mongodb - Run mongodb on the local machine on the default port of 27017.
2. Start rep_ent.py by running `python3 rep_ent.py -s`
3. Start the third party app subsytem by running `node ./3app-Subsystem/3rd_app_SS.js`
4. Start the network subsystem by running `node ./Network-Subsystem/server.js`

Each of these subsystems are responsible for some of the functionality of the Reputation Machine. Several of these subsystems communicate using http requests to localhost. Each of these subsystems will be discussed in depth below.

### Network Subsystem

The Network Subsystem is reponsible for handling websocket communication between multiple nodes. It also serves a standard HTTP api to handle communication between other systems of the Reputation Machine. Starting the server is a straightforward process. Simply clone this repo, and run `node server.js path/to/config.ini`. When starting the server you may, but do not have to, supply the path to a config file. If no config file path is specified, the default config file located at `./ReputationMachine/Network-Subsystem/config.ini` is used.

A WebSocket server can only accept incoming connection requests. However, the reputation machine needs to be able to accept incoming requests and spawn outgoing request. Because of this, the network subsystem has two main components: the client manager (client_manager.js), and the WebSocket server (socker_server.js). The client manager holds a list of WebSocket clients (socket_client.js) and handles any operations that need to apply to alll clients. The WebSocket server listens for incoming requests. Both WebSocket clients and the WebSocket server use a common connection manager (connection_manager.js) to create, process, and respond to WebSocket messages. Because of this, a common WebSocket Messaging protocol can be used across all WebSocket clients and servers.

#### Config File Structure

The config file is an [ini file](https://en.wikipedia.org/wiki/INI_file) with the following structure:

```text
[Peers]
DefaultPeers[] = ws://url1.xyz:8080
DefaultPeers[] = ws://url2.xyz:8989
DefaultPeers[] = ws://10.1.1.1:80
...

[ServerConfig]
NodeCommunicationPort = 8000
APIPort = 8080
CacheRefresh = 900000
CacheTime = 43200000
CacheMaxSize = 100

[MessageConfig]
DefaultTTL = 5
PercenReceiptsSave = 75
```

Here is a brief explanation of each parameter:

- DefaultPeers[]: A list of other nodes to attempt to make a WebSocket connection to when the network subsystem starts up. There is no upper or lower bound to the number of nodes you can list here.
- NodeCommunicationPort: The port to listen for incoming WebSocket connections on.
- APIPort: The port to serve the HTTP API used for localhost communication. Changing this from the default value of 8080 may break other parts of the Reputation Machine.
- CacheRefresh: WebSocket messages are cached so that the system can drop duplicate messages. The CacheRefresh time is how often the system will check to clear outdated info from the cache.
- CacheTime: How long a message is held in the cache before it is dropped on the next refresh.
- CacheMaxSize: The maximum number of unique messages to hold in the cache.
- DefaultTTL: The default number of hops for a message to go in the network before it is dropped. This number is used only for new messages originating from this node.
- PercentageReceiptsSave: A node in the network may see many reputation receipts move throughout the network. This is the percentage of receipts that it will save to the local database. 

#### Server Commands

When the server is running, you have the ability to send commands to the server by typing in the terminal. The available commands are as follows:

##### PEER

**Syntax**: peer *URL*  
**Description**: The peer command opens a new WebSocket connection to the given URL. This is used to manually add a connection to another Reputation Machine node.

##### CLOSE

**Syntax**: close [client|server] *URL*  
**Description**: Manually close a connection to a node you are connected. You may specify if this node is the client or server role in the WebSocket connection. However, that is optional. If neither client nor server is specified, any connection with the givern URL will be closed.

##### SHOW

**Syntax**: show [client|server] connections  
**Description**: Shows connections to other nodes. You may specify if this node is the client or server role in the websocket connection. However, that is optional. If neither client nor server is specified, all connections are listed.

##### SEND

**Syntax**: send from {client|server|all} *MESSAGE*  
**Description**: Send a message from your server to nodes you are peered with. You must specify if you want the message to be sent from this node's clients, server, or both.


#### RECONNECT

**Syntax**: reconnect
**Description**: Drop all connections and spawn connections from the loaded config file
