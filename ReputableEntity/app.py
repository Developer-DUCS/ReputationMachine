# File: api.py
# Author: Julian Fisher
# Date: 10/30/2022
# Purpose: Define an API that will be used to enable 
# reputable entities to communicate with each other 
# and with the blockchain

from flask import Flask
from flask import request
import requests
import configparser
import db

CONFIG_FILE = "config.ini"

# Create database connection
config = configparser.ConfigParser()
config.read(CONFIG_FILE)
tableName = config['sqlite']['receiptTableName']
dbConn = db.DBConnection(config['sqlite']['dbName'])

print(tableName)
app = Flask(__name__)

@app.route("/writeReceipt",methods=['POST'])
def writeReceipt():
    receiptData = request.json
    q = f"INSERT INTO {tableName} (receipt) VALUES (\"{receiptData['receipt']}\");"
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
    return -1

@app.route("/verifyReceipt",methods=['POST'])
def verifyReceipt():
    return -1