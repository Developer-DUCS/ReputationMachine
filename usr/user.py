#!/usr/bin/python
#File Name: user.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the user subsystem

import uuid
import os.path
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
        client = "mongodb://localhost:27017/"
        db = "receiptDB"
        collection = "receipts"
        self.dbManager = self.create_database(client, db, collection)
    
    def get_db(self):
        return self.dbManager
    
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
        signature = self.my_keychain.sign_rep_mach(msg)
        return signature
        
    def get_blockchain_wallet(self):
        return self.my_keychain.get_blockchain_wallet()
        
    def sign_rep_mach(msg):
        return keychain.sign_rep_mach(msg)
        
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
        
    
