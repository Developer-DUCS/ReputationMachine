#!/usr/bin/python
# File Name: app.py
# Author: Jon Sigman
# Date: 12/11/22
# Description: This app provides some bitcoin rpc results as a service to the RE's.
# api                   verb     description                    status codes
# /                     get      rpc call getblockchain info    200 ()
# /getrawtransaction    get      rpc call getrawtransaction     200 ()
#                                with verb 2
#                                                               404 ()
# © Drury University 2023

from flask import flask, render_template
import subprocess
import re
app = flask(__name__)

@app.route('/')
def get_info():
    get_info = subprocess.check_output(["bitcoin-cli", "getblockchaininfo"], text=True)
    return get_info

@app.route('/getrawtransaction/<txid>')
def get_raw_tx(txid):
    sanitize = verify_txid(txid)
    if(sanitize == False):
        return render_template('404.html'), 404
    else:
        get_raw_tx = subprocess.check_output(["bitcoin-cli", "getrawtransaction", str(txid) , "2" ], text=True)
        return get_raw_tx

def verify_txid(txid):
    if (len(txid) != 64):
        return False
    invalid_char = bool(re.match("^[A-Fa-f0-9_-]*$", txid))
    return invalid_char