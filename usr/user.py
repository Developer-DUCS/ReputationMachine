#!/usr/bin/python
#File Name: user.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the user subsystem

import uuid
import os.path
import sys
import json
from keychain import keychain
from database_manager import DatabaseManager
import pymongo

class user:
        
    def __init__(self, username):
        self.obj_id = uuid.uuid4().hex
        self.usrn = username
        self.file_loc = path=os.getcwd()
        self.file_name = '/usr/' + self.usrn + '.json'
        self.state_file_loc = self.file_loc + self.file_name
        self.my_keychain = keychain(username)
        self.config = None
        self.load_config()
        self.client = "mongodb://localhost:27017/"
        self.db = "receiptDB"
        self.collection = "receipts"
        self.dbManager = self.create_database(self.client, self.db, self.collection)
        
    def load_config(self):
        try:
            f = open('./007/re_cfg.json')
        except FileNotFoundError:
            print("Configuration file not found.")
            sys.exit(6)
        self.config = json.load(f)
        f.close()
        try:
            self.client = self.config['client']
            self.db = self.config['db']
            self.collection = self.config['collection']
        except KeyError:
            print("No database configuration found. Loading defaults...")
            self.client = "mongodb://localhost:27017/"
            self.db = "db" "receiptDB"
            self.collection = "receipts"
             
    def get_db(self):
        return self.dbManager
    
    def get_rep_mach_key_pair(self):
        return self.my_keychain.create_rep_mach_key_pair_req()
    
    def get_user(self):
        return self.usrn
        
    def get_uuid(self):
        return self.obj_id
        
    def set_uuid(self, original_uuid):
        self.obj_id = original_uuid
        
    def save(self):
        temp_f = {
            "name": self.usrn,
            "uuid": self.obj_id
        }
        with open(self.state_file_loc, "w") as outfile:
            json.dump(temp_f, outfile)
            
    def sign_rep_mach(self, msg):
        signature = self.my_keychain.sign_rep_mach_rec(msg)
        return signature
        
    def get_blockchain_wallet(self):
        return self.my_keychain.get_blockchain_wallet()
        
    #==============================================
        #Database functions
    #==============================================
    
    def create_database(self, client, db, collection):
        client = pymongo.MongoClient(client)
        db = client[db]
        collection = db[collection]
    
        dbManager = DatabaseManager(client, db, collection)
        dbManager.createMongoDB({"init": "db"})
        return dbManager
        
    def load_database(self, client, db, collection):
        client = pymongo.MongoClient(client)
        db = client[db]
        collection = db[collection]
    
        dbManager = DatabaseManager(client, db, collection)
        
    
