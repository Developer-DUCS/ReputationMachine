#!/usr/bin/python
#File Name: rep_ent.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the control sub-module for the reputable entity.
#© Drury University 2023

import os
import sys
file_loc = path=os.getcwd()
sys.path.insert(0, file_loc+'/usr')
# from user_manager import user_manager
from usr.user_manager import user_manager
sys.path.insert(0, file_loc+'/blockchain')
from blockchain import blockchain
import argparse
import signal
from flask import Flask, request
from bson import json_util
from hashlib import sha256
import json
# import queue
from getpass import getpass
# from getpass import getuser
import requests
import time
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from Crypto.Hash import SHA256

app = Flask('3ap')
scheduler = BackgroundScheduler()
NETWORK_URL = "http://127.0.0.1:8080"

#======================================
  # 3AP Routes
#======================================

@app.route('/verifyReceipt', methods=['POST'])
def verifyReceipt():
    check = verify_receipt(blockchain, request.json['txid'], request.json['fingerprint'])
    print("TESTING")
    return str(check)

@app.route('/saveReceipt', methods=['POST'])
def saveReceipt():
    rcpt = request.json
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    dbManager.addReceiptsToDB(request.json)    
    return json_util.dumps(request.json)

@app.route('/createReceipt', methods=['POST'])
def createReceipt():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    
    if type(request.json) == list:
        validReceipts = []
        for receipt in request.json:
            info = embed_fingerprint(user, blockchain, json.dumps(receipt))
            txid = info[0]
            fp = info[1].hex()
            temp = addDetailsToReceipt(receipt, fp, txid)
            validReceipts.append(temp)
        dbManager.addReceiptsToDB(validReceipts)

        return json_util.dumps(validReceipts)
    else:
        info = embed_fingerprint(user, blockchain, json.dumps(request.json))
        txid = info[0]
        fp = info[1].hex()
        result = addDetailsToReceipt(request.json, fp, txid)
        dbManager.addReceiptsToDB(result)
        return json_util.dumps(result)
        
def addDetailsToReceipt(data, fp, txid):
    stableJSON = json.dumps(data, sort_keys=True)
    receiptHash = sha256(stableJSON.encode('utf-8')).hexdigest()
    res = json.loads(stableJSON)
    res["txid"] = txid
    res["fingerprint"] = fp
    res["_id"] = receiptHash
    res["status"] = "pending"
    return res

@app.route('/getReceipts', methods=['POST'])
def getReceipt():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    
    url = NETWORK_URL +"/getReceipts"
    res = requests.post(url, json = request.json)
    print(res.json())
    #TODO: pass a request for the given id to the network and get the receipts from the network
    return json.dumps(res.json())

@app.route('/retrReceipts', methods=['POST'])
def retrReceipt():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    receipts = dbManager.getReceiptsFromDB(request.json, True)
    return json.dumps(receipts)

@app.route('/embedStatus', methods=['POST'])
def embedStatus():
    print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
    status = dbManager.getStatus(request.json)
    return status

# @app.route('/updateReceipts', methods=['POST'])
# def updateReceipts():
#     print('Request coming from: ' + request.environ['REMOTE_ADDR'] + '\n')
#     dbManager.updateReceipts(request.json)
#     return "Updated Receipts"

#======================================
  # Blockchain Functions
#======================================

def get_balance_btc(blkchain):
    blkchain.get_balance_btc()
    
def get_recieve_address(blkchain):
    blkchain.get_recieve_address()

def get_transaction(txid, blkchain):
    result = blkchain.get_tx(txid)
    pretty_rslt = json.dumps(result, indent=2)
    print(pretty_rslt)
    
def verify_receipt(blkchain, txid, fingerprint):
    rslt = blkchain.validate_fp_in_txid(txid, fingerprint)
    return(rslt)
        
def embed_fingerprint(user_obj, blkchain, fp):
    sign = user_obj.sign_rep_receipt(fp)
    tx_hash = blkchain.embed_fingerprint(sign.hex())
    receipt_info = (tx_hash, sign)
    return receipt_info

def gen_pub(usr_mgr, gpk):
    pk_list = []
    for i in range(gpk):
        kp = usr_mgr.get_rep_mach_key_pair()
        pk = kp[0]
        pk_list.append(pk)

    for i in range(gpk):
        print(pk_list[i-1])

#======================================
  # User Functions
#======================================

def start(user_obj, blockchain_obj):
    global user
    global blockchain
    global dbManager 
    user = user_obj
    blockchain = blockchain_obj
    dbManager = user_obj.get_db()
    scheduler.add_job(func=(check_pending_receipts), trigger="interval", seconds=20)
    scheduler.start()

    app.run(host='127.0.0.1', port=3030)

def verify_file_struct():
    pwd = path=os.getcwd()
    secret = pwd + "/007/"
    keys = secret + "keys/"
    blockchain = keys + "blockchain/"
    rep_mach = keys + "rep_mach/"
    if not os.path.isdir(secret):
        os.mkdir(secret)
    if not os.path.isdir(keys):
        os.mkdir(keys)
    if not os.path.isdir(blockchain):
        os.mkdir(blockchain)
    if not os.path.isdir(rep_mach):
        os.mkdir(rep_mach)
        
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
        
#======================================
  # Genearal Helper Functions
#======================================

def check_pending_receipts():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))
    receipts = dbManager.getPending()
    for receipt in receipts:

        rslt = verify_receipt(blockchain, str(receipt["txid"]), str(receipt["fingerprint"]))
        if rslt is True:
            print("Receipt has confrimed: " + str(receipt["_id"]))
            confirmed = receipt
            dbManager.updateReceipts(confirmed)
            receipt.pop("status")

            url = NETWORK_URL +"/shareReceipt"
            res = requests.post(url, json = {"receipt": receipt})
            print("removing pending status from receipt " + str(receipt["_id"]) + " from the database.")

def _sigint_handler_(signum, frame):
    # Handle ^c
    print(" -Got SIGINT-")
    atexit.register(lambda: scheduler.shutdown())
    sys.exit(1) # - Exexution terminated from outside
        
def _sigterm_handler_(signum, frame):
    # Handle shell kill
    print(" -Got SIGTERM-")
    atexit.register(lambda: scheduler.shutdown())
    sys.exit(1) # - Exexution terminated from outside
    
def sig_to_hex(sign):
    #send an ECDSA signature encoded in a bytes object
    # and reutrn the hexadecimal representation of it.
    hexa = ""
    for char in sign.hex():
        hexa += format(ord(char), "x")
    return hexa
    
#======================================
  # Main
#======================================

def setup():
    passwd = ""
    # Sort out the command line options.
    parser = argparse.ArgumentParser()
    help_str_embed = "add a new user"
    parser.add_argument("-er", "--embed_receipt", help=help_str_embed, type=str, default="")
    help_str_gtx = "retreive a bitcoin testnet transaction"
    help_str_pk = "generate public keys"
    parser.add_argument("-gpk", "--gen_pubkey", help=help_str_pk, type=int, default="1")
    parser.add_argument("-gtx", "--get_tx", help=help_str_gtx, type=str, default="")
    help_str_tx = "provide a txid for verification"
    parser.add_argument("-tx", "--tx", help=help_str_tx, type=str, default="")
    help_str_fp = "provide a fingerprint for verification"
    parser.add_argument("-fp", "--fp", help=help_str_fp, type=str, default="")
    help_str_gb = "retreive the testnet bitcoin wallet balance in btc and usd"
    parser.add_argument("-gb", "--get_balance", help=help_str_gb, action="store_true")
    help_str_gb = "get the testnet btc recieve address"
    parser.add_argument("-gra", "--get_recieve_address", help=help_str_gb, action="store_true")
    help_str_start = "start the reputable entity service"
    parser.add_argument("-s", "--start", help=help_str_gb, action="store_true")
    
    args = parser.parse_args()
    
    #define arg variables
    get_tx = args.get_tx
    #user_add = args.user_add
    get_balance = args.get_balance
    get_address = args.get_recieve_address
    start_flg = args.start
    embed = args.embed_receipt
    finger = args.fp
    tx = args.tx
    gpk = args.gen_pubkey
    
    #variables
    active_user = ""
    crte_user = False
    conf_flag = False
    
    #load config
    try:
        f = open('./007/re_cfg.json')
    except FileNotFoundError:
        #verify and create file struct for 007
        verify_file_struct()
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

        if start_flg:
            print("starting the reputable entity service")
            start(user_obj, blkchain)
        
    else:
        print("User not found. Please try again.")
        sys.exit(0)
    #instantiate other subsystems
    if get_balance:
        get_balance_btc(blkchain)
    elif get_address:
        get_recieve_address(blkchain)
    elif embed:
        #determine if information was passed as relative file path or not
        eh_flg = False
        if not os.path.isfile(embed):
            eh_flag = True
            pwd = path=os.getcwd()
            eh_embed = pwd + "/" + embed
            if not os.path.isfile(eh_embed):
                print("Please input the receipt as a filepath to the receipt input.")
                sys.exit(5)
        if eh_flg:
            embed = eh_embed
        #read the receipt from the file
        f = open(embed)
        test_receipt = json.load(f)
        f.close()
        test_receipt = str(test_receipt)
        #embed the fingerprint in the blockchain and return the txid and signature
        sig_id = embed_fingerprint(user_obj, blkchain, test_receipt)
        txid = sig_id[0]
        fingerprint = sig_id[1]
        print("txid", txid)
        print("fingerprint", sig_to_hex(fingerprint))
            
    elif get_tx:
        print(get_transaction(get_tx, blkchain))
    elif finger and tx:
        verify_receipt(blkchain, tx, finger)
    elif gpk:
        gen_pub(user_obj, gpk)
        
if __name__ == '__main__':
    signal.signal(signal.SIGINT, _sigint_handler_) # Create handler for ^c
    signal.signal(signal.SIGTERM, _sigterm_handler_) # Create handler for shell kill
    setup()
    
    
    
