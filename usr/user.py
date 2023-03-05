#!/usr/bin/python
#File Name: user.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the user subsystem

import uuid
import os.path
import json

class user:
        
    def __init__(self, username):
        self.obj_id = uuid.uuid4().hex
        self.usrn = username
        self.file_name = '/usr/' + self.usrn + '.json'
        self.file_loc = path=os.getcwd() + self.file_name
        
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
        with open(self.file_loc, "w") as outfile:
            json.dump(temp_f, outfile)
