# File: init_db.pt
# Author: Julian Fisher
# Date: 11/1/2022
# Purpose: Initialize the database for the
# receipt sharing network

from termcolor import colored
import configparser
import os
import db

CONFIG_FILE = "config.ini"

# Display warning and ask for confirmation
print(colored('''Warning: Running this script will remove all data from the current database. Please type "confirm" to confirm that you want to continue.''', 'red'))
if input() == "confirm":
    #read config
    config = configparser.ConfigParser()
    config.read(CONFIG_FILE)
    
    #remove old DB
    if os.path.exists(config['sqlite']['dbName']):
        os.remove(config['sqlite']['dbName'])
    else:
        print("NO DB FILE FOUND")
    
    #create new DB and table
    dbConn = db.DBConnection(config['sqlite']['dbName'])
    dbConn.query(f"CREATE TABLE {config['sqlite']['receiptTableName']}(ID INTEGER PRIMARY KEY AUTOINCREMENT, receipt varchar(1000));")

else:
    print("cancelled")