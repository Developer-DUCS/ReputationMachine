#!/usr/bin/python
#File Name: keychain.py
#Author: Jon Sigman
#Date: 2/26/23
#Description: This is the user's cryptographic keychain

import uuid
import os.path
import json
from bit import Key
from Crypto.Hash import SHA256
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS


class keychain:
        
    def __init__(self, username):
        self.obj_id = uuid.uuid4().hex
        self.usrn = username
        self.blockchain_wif = None
        self.rep_mach_prikey = None
        self.rep_mach_pubkey = None
        self.file_loc = path=os.getcwd()
        self.blockchain_key_path = '/007/keys/blockchain/key_' + self.usrn + '.json'
        self.rep_mach_key_path =  '/007/keys/rep_mach/key_' + self.usrn + '.pem'
        self.blockchain_key_file_loc = self.file_loc + self.blockchain_key_path
        self.rep_mach_key_file_loc = self.file_loc + self.rep_mach_key_path
        self.load_blockchain_keys()
        self.load_rep_mach_key_pair()
        
    def create_rep_mach_key_pair(self):
        self.rep_mach_prikey = ECC.generate(curve='P-256')
        self.rep_mach_pubkey = ECC.EccKey.public_key(self.rep_mach_prikey)

    def create_rep_mach_key_pair_req(self):
        prikey = ECC.generate(curve='P-256')
        pubkey = ECC.EccKey.public_key(prikey)
        return (pubkey, prikey)
        
    def create_blockchain_key_pair(self):
        blockchain_prikey = Key()
        self.blockchain_wif = blockchain_prikey.to_wif()
        
    def load_blockchain_keys(self):
        decode_error = False
        if os.path.isfile(self.blockchain_key_file_loc):
            print("loading existing blockchain key file")
            f = open(self.blockchain_key_file_loc)
            try:
                initial_key_pairs = json.load(f)
            except json.decoder.JSONDecodeError:
                print("error reading user: " + self.usrn + "'s blockchain key file.")
                decode_error = True
            if not decode_error:
                self.blockchain_wif = initial_key_pairs['wif']
        else:
            print("creating new blockchain key file")
            self.create_blockchain_key_pair()
            f = open(self.blockchain_key_file_loc, "w+")
            initial_key_pairs = {
                "wif": self.blockchain_wif
            }
            f.write(json.dumps(initial_key_pairs, sort_keys=True, indent=4, separators=(',', ': ')))
        f.close()
        
    def load_rep_mach_key_pair(self):
        if os.path.isfile(self.rep_mach_key_file_loc):
            print("loading existing reputation machine key file")
            f = open(self.rep_mach_key_file_loc)
            self.rep_mach_prikey = ECC.import_key(f.read())
            self.rep_mach_pubkey = ECC.EccKey.public_key(self.rep_mach_prikey)
            f.close()
        else:
            print("creating new reputation machine key file")
            self.create_rep_mach_key_pair()
            f = open(self.rep_mach_key_file_loc, 'wt')
            f.write(self.rep_mach_prikey.export_key(format='PEM'))
            f.close()
            
    def sign_rep_mach_rec(self, msg):
        msg = msg.encode("utf8")
        msg_hash = SHA256.new(msg)
        ds = DSS.new(self.rep_mach_prikey, 'fips-186-3')
        signature = ds.sign(msg_hash)
        return signature
        
    def get_blockchain_wallet(self):
        return self.blockchain_wif
        
    def get_user(self):
        return self.usrn
        
    def get_uuid(self):
        return self.obj_id
        
    def set_uuid(self, original_uuid):
        self.obj_id = original_uuid
