#!/usr/bin/python
#File Name: user.py
#Author: Jon Sigman
#Date: 2/12/23
#Description: This is the user-manager

import uuid
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
        self.pwflag = False
        self.shadow = None
        
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
        print(salt)
        print(hashed)
        
    def check_passwd(self, pwd):
        salt = self.salt
        print("salt: " + str(salt))
        hashed = self.shadow
        if bcrypt.checkpw(pwd.encode('utf8'), hashed.encode('utf8')):
            self.pwflag = True

    def load_user(self, usr, pwd):
        filen = "/usr/" + usr + ".json"
        state_file_location = self.file_loc + filen
        if os.path.isfile(state_file_location):
            #open user state file
            f = open(state_file_location)
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
            self.salt = config['salt']
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
        
    def crte_user(self, user, passwd):
        conf_flag = False
        print("Adding user to re_cfg.json")
         #Does config file contain valid json
        f = open(self.config_file_loc, "w+")
        try:
            config = json.load(f)
        except json.decoder.JSONDecodeError:
            conf_flag = True
        #add user to cfg
        if conf_flag == True:
            config = {"user": user}
        else:
            config.update({"user":user})
        print("Handling password security.")
        #add salt to config
        slt = self.create_salt(passwd) 
        config.update({"salt":str(slt)})
        #f = open(self.config_file_loc, "w+")
        f.write(json.dumps(config, sort_keys=True, indent=4, separators=(',', ': ')))
        f.close()
        #add hash to shadow file
        hashed = self.create_hash(passwd, slt)
        f = open(self.shadow_file_loc, "w+")
        try:
            shadow_config = json.load(f)
        except json.decoder.JSONDecodeError:
            shadow_config = {}
        shadow_config.update({user:str(hashed)})    
        f.write(json.dumps(shadow_config, sort_keys=True, indent=4, separators=(',', ': ')))
        f.close()
        
        print("Create a saved state for the new user.")
        #try:
            #slt = config['salt']
        #except KeyError:
            
