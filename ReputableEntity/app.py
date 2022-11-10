# File: api.py
# Author: Julian Fisher
# Date: 10/30/2022
# Purpose: Define an API that will be used to enable
# reputable entities to communicate with each other
# and with the blockchain

from quart import Quart
from quart import request
import requests
import configparser
import db
import socket

CONFIG_FILE = "config.ini"

# Create database connection
config = configparser.ConfigParser()
config.read(CONFIG_FILE)
tableName = config['sqlite']['receiptTableName']
dbConn = db.DBConnection(config['sqlite']['dbName'])

app = Quart(__name__)

@app.route("/writeReceipt",methods=['POST'])
def writeReceipt():
    receiptData = request.json
    q = f"INSERT INTO {tableName} (receipt) VALUES (\"{receiptData['receipt']}\");"
    res = dbConn.query(q)
    if res == []:
        return "SAVED"
    else:
        return "ERROR"

@app.route("/receipt",methods=['GET'])
def receipt():
    res = dbConn.query(f"SELECT * FROM {tableName};")
    print(res)
    return f'"results": {res}'

@app.route("/publishReceipt",methods=['POST'])
def publishReceipt():
    # get a list of the addresses of our neighbors
    neighborsFromConfig = config.items('RE-Connections')

    reqIP = request.remote_addr
    for neighbor in neighborsFromConfig:
        # send a request to each neighbor
        neighborIP = socket.gethostbyname(neighbor[1].split(":")[0])

        # send a request to the neighbor if the incoming request was not from that neighbor
        neighborRequests = []
        if neighborIP != reqIP:
            neighborRequests.append(grequests.post("http://" + neighborIP + "/publishReceipt"))
        
        res = grequests.map(neighborRequests)
    return res

@app.route("/verifyReceipt",methods=['POST'])
def verifyReceipt():
    return -1

if __name__ == "__main__":
    app.run()