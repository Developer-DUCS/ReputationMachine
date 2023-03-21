#!/usr/bin/python
#File Name: rep_ent.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the control sub-module for the reputable entity.
# txid: b1be038b5b0c095c927857cde9817805692866e4ba7a183bb843602dafce4009

import os
import sys
file_loc = path=os.getcwd()
sys.path.insert(0, file_loc+'/usr')
from user_manager import user_manager
sys.path.insert(0, file_loc+'/blockchain')
from blockchain import blockchain
import argparse
import signal
from flask import Flask, request
from bson import json_util
from hashlib import sha256

import json
import queue
from getpass import getpass
from getpass import getuser

app = Flask('3ap')

#======================================
  # 3AP Routes
#======================================
@app.route('/saveReceipt', methods=['POST'])
def saveReceipt():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    
    #TODO: implement a check to see if the receipt received from the network exist on the blockchain
    #only a TODO if we want to check every receipt that comes in from the network
    dbManager.addReceiptsToDB(request.json)
    
    return json_util.dumps(request.json)

@app.route('/createReceipt', methods=['POST'])
def createReceipt():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    
    if type(request.json) == list:
        validReceipts = []
        for receipt in request.json:
            temp = addHashToReceipt(receipt)
            validReceipts.append(temp)
        dbManager.addReceiptsToDB(validReceipts)
        return json_util.dumps(validReceipts)
    else:
        result = addHashToReceipt(request.json)
        dbManager.addReceiptsToDB(result)
        #TODO: pass the receipt to the blockchain for embeding
        return json_util.dumps(result)
        
def addHashToReceipt(data):
    stableJSON = json.dumps(data, sort_keys=True)
    receiptHash = sha256(stableJSON.encode('utf-8')).hexdigest()
    res = json.loads(stableJSON)
    res["_id"] = receiptHash
    res["status"] = "pending"
    return res

@app.route('/getReceipts', methods=['POST'])
def getReceipt():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    receipts = dbManager.getReceiptsFromDB(request.json, True)
    #TODO: pass a request for the given id to the network and get the receipts from the network
    return json.dumps(receipts)

@app.route('/embedStatus', methods=['POST'])
def embedStatus():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    status = dbManager.getStatus(request.json)
    return status

@app.route('/updateReceipts', methods=['POST'])
def updateReceipts():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    dbManager.updateReceipts(request.json)
    return "Updated Receipts"

#======================================


def _sigint_handler_(signum, frame):
    # Handle ^c
    print(" -Got SIGINT-")
    sys.exit(1) # - Exexution terminated from outside
        
def _sigterm_handler_(signum, frame):
    # Handle shell kill
    print(" -Got SIGTERM-")
    sys.exit(1) # - Exexution terminated from outside
    
def start(user_obj):
    print("made it")
    global dbManager 
    dbManager = user_obj.get_db()
    print(user_obj)
    app.run(host='127.0.0.1', port=3030)

def get_transaction(txid, blkchain):
    result = blkchain.get_tx(txid)
    pretty_rslt = json.dumps(result, indent=2)
    print(pretty_rslt)
    
def get_balance_btc(blkchain):
    blkchain.get_balance_btc()
    
def get_recieve_address(blkchain):
    blkchain.get_recieve_address()
    
def get_password(username):
    print("Please specify a password for this user: ")
    password = getpass()
    print("Please specify the password this user again: ")
    password2 = getpass()
    if password == password2:
        #passwords match
        print("passwords match")
    else:
        #passwords do not match
        print("The passwords do not match. Please try again")
        get_password(username)
    return password

def setup():
    passwd = ""
    # Sort out the command line options.
    parser = argparse.ArgumentParser()
    help_str_ua = "add a new user"
    parser.add_argument("-ua", "--user_add", help=help_str_ua, type=str, default="")
    help_str_gtx = "retreive a bitcoin testnet transaction"
    parser.add_argument("-gtx", "--get_tx", help=help_str_gtx, type=str, default="")
    help_str_gb = "retreive the testnet bitcoin wallet balance in btc and usd"
    parser.add_argument("-gb", "--get_balance", help=help_str_gb, action="store_true")
    help_str_gb = "get the testnet btc recieve address"
    parser.add_argument("-gra", "--get_recieve_address", help=help_str_gb, action="store_true")
    help_str_start = "start the reputable entity service"
    parser.add_argument("-s", "--start", help=help_str_gb, action="store_true")
    
    args = parser.parse_args()
    
    #define arg variables
    get_tx = args.get_tx
    user_add = args.user_add
    get_balance = args.get_balance
    get_address = args.get_recieve_address
    start_flg = args.start
    
    #variables
    active_user = ""
    crte_user = False
    conf_flag = False
    
    #load config
    try:
        f = open('./007/re_cfg.json')
    except FileNotFoundError:
        f = open('./007/re_cfg.json', "w+")
        config = {}
        f.write(json.dumps(config, sort_keys=True, indent=4, separators=(',', ': ')))
        conf_flag = True
        print("Configuration file not found.")
    #instantiate user subsystem
    user_obj = user_manager()
    #handle user credentials
    if not conf_flag:
        config = json.load(f)
        f.close()
        try:
            active_user = config['user']
        except KeyError:
            # no configured user. call create_user() to create
            # the required configuration.
            print("No user found in re_cfg.json file.")
            new_user = input("Please enter a new username:")
            print(new_user)
            passwd = get_password(new_user)
            active_user = new_user
            #create user flag
            crte_user = True
    else:
        # no configured file at all
        f.close()
        print("No user found in re_cfg.json file.")
        new_user = input("Please enter a new username:")
        print(new_user)
        passwd = get_password(new_user)
        active_user = new_user
        #create user flag
        crte_user = True
    
    #make sure passwd has a vlaue
    if not passwd:
        passwd = getpass(prompt='Please enter your password: ')
    #load user from config
    #login_flg = user_obj.load_user(config['user'], config['password'])
    if crte_user:
        user_obj.crte_user(active_user, passwd)
    login_flg = user_obj.load_user(active_user, passwd)
    if login_flg == True:
        active_usr = user_obj.get_active_user()
        user_obj.save_user()
        blkchain = blockchain()
        blkchain.load_wallet(user_obj.get_wallet())
        
    else:
        print("User not found. Please try again.")
        sys.exit(0)
    
    #instantiate other subsystems
    if start_flg:
        print("starting the reputable entity service")
        start(user_obj)

if __name__ == '__main__':
    signal.signal(signal.SIGINT, _sigint_handler_) # Create handler for ^c
    signal.signal(signal.SIGTERM, _sigterm_handler_) # Create handler for shell kill
    setup()
    
    
    
