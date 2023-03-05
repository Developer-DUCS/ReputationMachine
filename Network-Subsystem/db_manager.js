// File: db_manager.js
// Author: Julian Fisher
// Date: 1/31/2023
// Description: This file defines a DatabaseManager class that can be used to
// make a manage many databases

const { NodeDiskStorage } = require('node-disk-storage')

class DatabaseManager {
    constructor(dbName){
        this.dbName = dbName
    }

    save (key, value) {
        return true;
    }

    get (key){
        return "test";
    }
}
/*
class DatabaseManager{
    constructor(dbName){
        this.dbName = dbName;
        this.db = new NodeDiskStorage();
    }

    async save(key, value){
        await this.db.set(key, value);
    }

    async get(key){
        result = await this.db.get(key);
        return result;
    }
}

*/
module.exports = DatabaseManager;