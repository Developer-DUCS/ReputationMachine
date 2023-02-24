#!/usr/bin/python
#File Name: blockchain.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the blockchain subsystem

import requests

class blockchain:
    
    def __init__(self):
        self.job_queue = []
        
    def get_tx(self, txid):
        self.secureRPC_call = "http://13.59.161.209:80/getrawtransaction/" + txid
        self.secureRPC_res = requests.get(self.secureRPC_call)
        return self.secureRPC_res.json()
