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
import json

CONFIG_FILE = "config.ini"


# Create database connection
config = configparser.ConfigParser()
config.read(CONFIG_FILE)
tableName = config['sqlite']['receiptTableName']
dbConn = db.DBConnection(config['sqlite']['dbName'])

app = Quart(__name__)

@app.route("/writeReceipt",methods=['POST'])
async def writeReceipt():
    receiptJson = request.body.__dict__['_data'].decode('utf8').replace("'",'"').replace("\r","").replace("\n","")
    q = f"INSERT INTO {tableName} (receipt) VALUES (\"{json.dumps(receiptJson)}\");"
    print(q)
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

    return res

@app.route("/verifyReceipt",methods=['POST'])
def verifyReceipt():
    return -1

@app.route("/receiptHash",methods=["GET"])
async def verifyHash():
    return {"hash": "hashVal"}

@app.route("/embedReceipt",methods=["POST"])
async def embedReceipt():
    return {"txid":"txid"}


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=9000) 