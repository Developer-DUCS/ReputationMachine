#!/usr/bin/python
#File Name: user.py
#Author: Jon Sigman
#Date: 2/12/23
#Description: This is the user-manager

#© Drury University 2023

# import uuid
from user import user
import os.path
import json
import bcrypt #not installed by default

class user_manager:
        
    def __init__(self):
        self.active_user = None
        self.file_loc = path=os.getcwd()
        self.shadow_file_loc = self.file_loc + "/007/shadow.json"
        self.config_file_loc = self.file_loc + "/007/re_cfg.json"
        self.state_file_location = None
        self.pwflag = False
        self.shadow = None
        
    def get_db(self):
        return self.active_user.get_db()
        
    def get_wallet(self):
        #make sure password auth done and login is complete
        if ((self.pwflag) and (self.active_user != None)):
            return self.active_user.get_blockchain_wallet()
            
    def sign_rep_receipt(self, msg):
        #make sure password auth done and login is complete
        if ((self.pwflag) and (self.active_user != None)):
            sign = self.active_user.sign_rep_mach(msg)
            return sign
        
    def create_salt(self, pwd):
        salt = bcrypt.gensalt()
        return salt
        
    def create_hash(self, pwd, salt):
        hashed = bcrypt.hashpw(pwd.encode('utf8'), salt)
        #decode to prevent double hash
        hashed = hashed.decode('utf8')
        return hashed
        
    def salt_and_hash_passwd(self, pwd):
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(pwd, salt)
        
    def check_passwd(self, pwd):
        hashed = self.shadow
        if bcrypt.checkpw(pwd.encode('utf8'), hashed.encode('utf8')):
            self.pwflag = True
    
    def get_rep_mach_key_pair(self):
        return self.active_user.get_rep_mach_key_pair()

    def load_user(self, usr, pwd):
        filen = "/usr/" + usr + ".json"
        self.state_file_location = self.file_loc + filen
        if os.path.isfile(self.state_file_location):
            #open user state file
            f = open(self.state_file_location)
            data = json.load(f)
            f.close()
            #instantiate user
            self.active_user = user(usr)
            #overwrite default values with values from saved state
            for (k, v) in data.items():
                if k == "uuid":
                    self.active_user.set_uuid(v)
            #load salt information
            f = open(self.config_file_loc)
            config = json.load(f)
            f.close()
            #load shadow file
            f = open(self.shadow_file_loc)
            shadow_config = json.load(f)
            f.close()
            self.shadow = shadow_config[usr]
            #validate password
            self.check_passwd(pwd)
            #self.salt_and_hash_passwd(pwd)
            if not self.pwflag:
                return False
            print("User " + usr + " has been authenticated.")
            return True
        else:
            return False
        
    def get_active_user(self): 
        rslt = self.active_user.get_user()
        return rslt
        
    def save_user(self):
        self.active_user.save()
        
    def create_config(self, user, passwd):
        print("create config enter")
        #create and handle errors around the general config file
        f = open(self.config_file_loc, "w+")
        try:
            config = json.load(f)
        except json.decoder.JSONDecodeError:
            conf_flag = True
        #add user to cfg
        if conf_flag == True:
            print("creating main config")
            config = {
                "user": user,
                "client": "mongodb://localhost:27017/",
                "db": "receiptDB",
                "collection": "receipts"
            }
        else:
            print("making config.update")
            config.update({
                "user": user,
                "client": "mongodb://localhost:27017/",
                "db": "receiptDB",
                "collection": "receipts"
            })
        f.write(json.dumps(config, sort_keys=True, indent=4, separators=(',', ': ')))
        f.close()
        
    def create_shadow(self, usr, passwd):
        #create and handle errors around the shadow file
        #add hash to shadow file
        slt = self.create_salt(passwd) 
        hashed = self.create_hash(passwd, slt)
        f = open(self.shadow_file_loc, "w+")
        try:
            shadow_config = json.load(f)
        except json.decoder.JSONDecodeError:
            shadow_config = {}
        shadow_config.update({usr:str(hashed)})    
        f.write(json.dumps(shadow_config, sort_keys=True, indent=4, separators=(',', ': ')))
        f.close()
        
    def create_state_file(self, usr):
    #create and handle errors around the users state file
        #save a state file for this user
        filen = "/usr/" + usr + ".json"
        self.state_file_location = self.file_loc + filen
        f = open(self.state_file_location, "w+")
        try:
            user_state = json.load(f)
        except json.decoder.JSONDecodeError:
            initial_key_pairs = {"user": self.active_user.get_user(),"uuid": self.active_user.get_uuid()}
            f.write(json.dumps(initial_key_pairs, sort_keys=True, indent=4, separators=(',', ': ')))
        f.close()
        active_user = None
        
    def crte_user(self, usr, passwd):
        conf_flag = False
        #instantiate user
        self.active_user = user(usr)
        #Does config file contain valid json
        self.create_config(usr, passwd)
        self.create_shadow(usr, passwd)
        self.create_state_file(usr)
        self.pwflag = True
            
