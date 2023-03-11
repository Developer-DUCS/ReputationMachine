// File: server.js
// Author: Julian Fisher
// Date: 12/9/2022
// Description: Initialize the server to handle sending and recieving websocket messages

const ini = require('ini');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
app.use(jsonParser);

const initCommandLine  = require('./server_commands');
const ConnectionHandler = require('./websocket-messaging/connection_manager');

let config;

// Check if a config file was provided, if so, load that config, if not, use the default config file
if (process.argv[2] == undefined) {
    config = ini.parse(fs.readFileSync('./config.ini','utf-8'))
}
else {
    config = ini.parse(fs.readFileSync(process.argv[2],'utf-8'))
}

const wsPort = config.ServerConfig.NodeCommunicationPort;
const apiPort = config.ServerConfig.APIPort;
const cacheRetentionTime = config.ServerConfig.CacheTime;
const cacheMaxSize = config.ServerConfig.CacheMaxSize;
const msgPrctSave = config.MessageConfig.PercentReceiptsSave;
const TTL = config.MessageConfig.DefaultTTL;

let connMan = new ConnectionHandler(cacheRetentionTime,cacheMaxSize,cacheRetentionTime,cacheMaxSize, wsPort, msgPrctSave);
console.log("WebSocket server listening on port", wsPort);

initCommandLine(connMan.clientManager,connMan.sockServ,config);

const getNumPeers = require('./api/getNumPeers');
const getPeers = require('./api/getPeers');
const createShareMsg = require('./api/createShareReceiptMessage');

// define API routes
app.get("/getNumPeers", (req, res) => {
    try {
        res.json(getNumPeers(connMan.sockServ,connMan.clientManager));
        res.status(200);
        res.send()
    }
    catch (e) {
        res.status(500);
        res.send();
    }
});

app.get("/getPeers", (req, res) => {
    try {
        res.json(getPeers(connMan.sockServ,connMan.clientManager));
        res.status(200);
        res.send()
    }
    catch (e) {
        res.status(500);
        res.send();
    }
});

app.post("/shareReceipt", (req, res) => {
    let receipt = req.body.receipt;
    let txid = req.body.txid;
    let srcPubKey = req.body.srcPubKey;
    let SrcIPorHost = "TEST";
    try {
        let shareMsg = createShareMsg(TTL, SrcIPorHost, receipt, txid, srcPubKey);
        connMan.handleMessage(shareMsg,null);
        res.status(200);
        res.send();
    } catch {
        res.status(500);
        res.send();
    }
});




app.listen(apiPort, () => {
    console.log("API listening on port",apiPort);
});

if (config.Peers.DefaultPeers != undefined){
    // spawn initial connections from config file
    config.Peers.DefaultPeers.forEach(url => {
        connMan.clientManager.addClient(url);
    });
}

setInterval(() => {
    console.log("Refreshing Cache");
    connMan.refreshCache();
}, config.ServerConfig.CacheRefresh)