# Network Subsystem

#### Designed and implemented by Julian Fisher

The Network Subsystem is reponsible for handling websocket communication between multiple nodes. It also serves a standard HTTP api to handle communication between other systems of the Reputation Machine. Starting the server is a straightforward process. Simply clone this repo, and run `node server.js path/to/config.ini`. When starting the server you may, but do not have to, supply the path to a config file. If no config file path is specified, the default config file located at `./ReputationMachine/Network-Subsystem/config.ini` is used.

A WebSocket server can only accept incoming connection requests. However, the reputation machine needs to be able to accept incoming requests and spawn outgoing request. Because of this, the network subsystem has two main components: the client manager (client_manager.js), and the WebSocket server (socker_server.js). The client manager holds a list of WebSocket clients (socket_client.js) and handles any operations that need to apply to alll clients. The WebSocket server listens for incoming requests. Both WebSocket clients and the WebSocket server use a common connection manager (connection_manager.js) to create, process, and respond to WebSocket messages. Because of this, a common WebSocket Messaging protocol can be used across all WebSocket clients and servers.

## Config File Structure

The config file is an [ini file](https://en.wikipedia.org/wiki/INI_file) with the following structure:

```INI
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

## WebSocket Messaging Protocol

The nodes in the network all communicate using WebSocket messaging. Each message is a JSON object that has a similar structure. The broad structure of a message is as follows:

```JSON
{
    "Header": {
        "MsgType": str,
        "TTL": int,
        "MsgID": str
    },
    "Body: {}
}
```

The MsgType field specifies what type of message is being sent. The MsgType should always be "ShareReceipt", "RequestReceipt", or "RequestResponse". Each message type has a unique body structure. The TTL is the number of hops the message will continue through the network. The TTL is pulled from the config for messages originating from this node. The MsgID is a unique message identifier. This is a randomly generated UUIDv4 in our implementation. The body for each message type is discussed below.

### Share Receipt

```JSON
{
    "Receipt": {
        "__id": str,
        "claim": {
            "category": str,
            "content": str,
            "id": str,
            "type": str
        },
        "source": str,
        "target": str,
        "txid": str,
        "fingerprint": str
    }
}
```

This message is sent throughout the network to allow other nodes in the network to save the given receipt to their local database. It contains a single reputation receipt that is propagated through the network.

### Request Receipt

```JSON
{
    "ReqParams": {"source": str}
}
```

OR

```JSON
{
    "ReqParams": {"target": str}
}
```

This message is used to request reputation receipts from the network. There are two valid body structures for this message. Either a source or target is specified and other nodes in the network will respond with all relevant receipts in their local database.

### Request Response

```JSON
{
    "ReqID": str,
    "Receipts": []
}
```

This message is sent as a response to a Request Receipt message. It consists of a "ReqID", which is the "MsgID" from the header of the related Request Receipt message, as well as a list of all receipts that are found in the local database.

## HTTP API

The network subsystem offers an HTTP API to bridge communication from other systems, into the distributed network facilitated by the network subsystem. Here is a brief overview of the HTTP API offered by the network subsystem.

### GET /numPeers

Returns the number of peers connected to this node.

### GET /peers

Returns a list of the peers that are connected to this node.

### POST /shareReceipt

Request Body:

```JSON
{
    "__id": str,
    "claim": {
        "category": str,
        "content": str,
        "id": str,
        "type": str
    },
    "source": str,
    "target": str,
    "txid": str,
    "fingerprint": str
}
```

Shares the given receipt with the network by sending out ShareReceipt messages.

### POST /getReceipts

Request Body:

```JSON
{
    "source": str
}
```

OR

```JSON
{
    "target": str
}
```

Response:

```JSON
{
    "receipts": []
}
```

Sends back a list of the receipts found in the network. This API call may take a while to respond as it waits to hear responses from other nodes in the network. In our implementation, this API call takes about five and a half seconds to respond.

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

## RECONNECT

**Syntax**: reconnect
**Description**: Drop all connections and spawn connections from the loaded config file