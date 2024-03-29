#!/usr/bin/python
#File Name: blockchain.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the blockchain subsystem

#© Drury University 2023

import requests
# import json
# import bson
from bit import PrivateKeyTestnet

class blockchain:
    
    def __init__(self):
        self.job_queue = []
        self.server = "http://13.59.161.209:80"
        self.get_tx_route = "/getrawtransaction/"
        self.my_wallet = None
        self.tx_amnt = 1
    
    def load_wallet(self, wif):
        self.my_wallet = PrivateKeyTestnet(wif)
        
    def get_balance_btc(self):
        print("===============================")
        print("Get Balance of wallet in test-net btc: ")
        print("My balance: " + self.my_wallet.get_balance('btc'))
        print("My balance of real btc in usd: " + self.my_wallet.balance_as('usd'))
        print("===============================")
        
    def get_recieve_address(self):
        print("===============================")
        print("My Recieve Address: " + self.my_wallet.address)
        print("===============================")
        
    def embed_fingerprint(self, fp):
        tx_hash = self.my_wallet.send([('muTp6WcLLmqG888rxKN6ZAe9mZzVPvwhbp', self.tx_amnt, 'usd')],message=fp)
        return tx_hash
        
    def get_tx(self, txid):
        self.secureRPC_call = self.server + self.get_tx_route + txid
        self.secureRPC_res = requests.get(self.secureRPC_call)
        return self.secureRPC_res.json()
        
    
    def get_confirmations(self, tx):
        transaction = self.get_tx(tx)
        try:
            confirmations = transaction["confirmations"]
        except KeyError:
            confirmations = 0
        return confirmations
        
    def reconstruct_op_return(self, script):
        data = ""
        for out in script:
            temp = str(out['hex'])
            data += temp[4:]
        return data

    def find_op_return(self, tx):
        transaction = self.get_tx(tx)
        tx_out = transaction["vout"]
        script = []
        for out in tx_out:
             ln = out["scriptPubKey"]["asm"].split(' ')
             for l in ln:
                 if l == "OP_RETURN":
                     script.append(out["scriptPubKey"])
                     break
        return self.reconstruct_op_return(script)
        
    def validate_fp_in_txid(self, txid, fingerprint):
        #fingerprint must be in hex
        data = bytes.fromhex(self.find_op_return(txid)).decode("utf-8")
        conf = self.get_confirmations(txid)
        if data == fingerprint and conf > 6:
            return True
        else:
            return False
        
            
        
