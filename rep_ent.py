#!/usr/bin/python
#File Name: rep_ent.py
#Author: Jon Sigman
#Date: 1/21/23
#Description: This is the control sub-module for the reputable entity.

import os
import sys
file_loc = path=os.getcwd()
sys.path.insert(0, file_loc+'/usr')
from user_manager import user_manager
sys.path.insert(0, file_loc+'/blockchain')
from blockchain import blockchain
import argparse
import signal
import json
from getpass import getpass
from getpass import getuser

def _sigint_handler_(signum, frame):
    # Handle ^c
    print(" -Got SIGINT-")
    sys.exit(1) # - Exexution terminated from outside
        
def _sigterm_handler_(signum, frame):
    # Handle shell kill
    print(" -Got SIGTERM-")
    sys.exit(1) # - Exexution terminated from outside
        
def get_transaction(txid):
    blkchain = blockchain()
    result = blkchain.get_tx(txid)
    pretty_rslt = json.dumps(result, indent=2)
    print(pretty_rslt)
    
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

def main():
    passwd = ""
    # Sort out the command line options.
    parser = argparse.ArgumentParser()
    help_str_ua = "add a new user"
    parser.add_argument("-ua", "--user_add", help=help_str_ua, type=str, default="")
    help_str_gtx = "retreive a bitcoin testnet transaction"
    parser.add_argument("-gtx", "--get_tx", help=help_str_gtx, type=str, default="")
    args = parser.parse_args()
    
    #define arg variables
    get_tx = args.get_tx
    user_add = args.user_add
    
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
        
    else:
        print("User not found. Please try again.")
        sys.exit(0)
    
    #instantiate other subsystems
    """
    #build argparse queue
    q = queue.Queue()
    if get_tx != "":
        gtx_tup = ("get_tx", get_tx)
        q.put(gtx_tup)
        
    #process argparse queue
    q_size = q.qsize()
    if q_size > 0:
        for i in range(q_size):
            action = q.get()
            if(action[0] == "get_tx"):
                get_transaction(action[1])
            
    """
signal.signal(signal.SIGINT, _sigint_handler_) # Create handler for ^c
signal.signal(signal.SIGTERM, _sigterm_handler_) # Create handler for shell kill
main()
sys.exit(0)
