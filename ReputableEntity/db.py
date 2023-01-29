# File: db.py
# Author: Julian Fisher
# Date: 10/30/2022
# Purpose: Create a connection to a sqlite database
# and manage define functions for use with the Reputable 
# Entity API

import sqlite3

# class DBConnection connects to a sqlite database whose database name 
# is defined in the config.ini file and defines methods that simplify
# interacting with the database
class DBConnection():
    # Initialize the database connection and create a cursor
    def __init__(self, dbName):
        self.conn = sqlite3.connect(dbName, check_same_thread=False)
        self.cur = self.conn.cursor()
    
    # Send a query to the database, commit the aciton, and return results
    def query(self,sql):
        results = self.cur.execute(sql)
        self.conn.commit()
        return results.fetchall()