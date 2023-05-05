"""
File Name: database_manager.py
Author: Brandon Alvarez
Date: 3/11/23
Description: The database manager for the mongoDB database that store all created and requested receipts
"""

# when implementing database_manager, make sure to import pymongo and create the following variables:
# client = pymongo.MongoClient("mongodb://localhost:27017/")
# db = client["receiptDB"] can be changed to whatever database name you want, will create a new database if it does not exist
# collection = db["receipts"]

"""
Database Manager class
"""
class DatabaseManager:
    
    """
    Header: database manager initializer
    params: client: The connected location that serves the database service, in this case it should always be a local db on port 27017
            db: the database to store the receipts in
            collection: the collection that contains the database
    return: none
    """
    def __init__(self, client, db, collection):
        self.client = client
        self.db = db
        self.collection = collection
        
    """
    Header: function to create a mongoDB database, needed because mongo does not create a database until a collection is added and a document
    is added to the collection
    params: initJSON: an initial document to add to the db to create it
    return: none
    """
    def createMongoDB(self, initJSON):
        databases = self.client.list_database_names()
        if self.db.name not in databases:
            self.collection.insert_one(initJSON)
            
    """
    Header: function to get receipts from the database
    params: id: json object (basically a python dictionary); expected format: {"source": "id"} or {"target": "id"} but format checking will not be handled at the database manager level
            valid: boolean; true if you want to get receipts that have been validated, false if you want to get receipts that have not been validated
    return: 
        Either:
            a list of receipts that match the query
            a String that says "No receipts found" when no receipts match the query    
    """ 
    def getReceiptsFromDB(self, id, valid):
        if len(id) > 1:
            return("Error: This method only accepts one id")

        key = list(id.keys())
        value = list(id.values())
        
        query = self.collection.find({"$and": [
            {"TXID": {"$exists": valid}},
            {key[0]: value[0]}
        ]}, {"_id": 0})
        results = list(query)
        
        if results == []:
            return("No receipts found")

        return results
    
    """
    Header: function to add receipts to the database, first checks if receipts already exists and adds to db if they do not
    params: receiptsToAdd: either a list of receipts or a single receipt to be added to the database
    return: none
    """
    def addReceiptsToDB(self, receiptsToAdd):
        if type(receiptsToAdd) == list:
            results = []
            for receipt in receiptsToAdd:
                query = self.collection.find({"_id": receipt["_id"]})
                if list(query) == []:
                    results.append(receipt)
            if results != []:
                self.collection.insert_many(results)
        else:
            query = self.collection.find({"_id": receiptsToAdd["_id"]})
            if list(query) == []:
                self.collection.insert_one(receiptsToAdd)

    """
    Header: helper function to update many receipts, assumes that the list will be mixed with successful embeds and failed embeds
    params: data: a list of json objects that contain a TXID and a Hash or a hash and a failed status
    return: none    
    """
    def updateManyReceipts(self, data):
        failed = []
        succeeded = []
        
        for value in data:
            if "status" in value:
                failed.append(value)
            else:
                succeeded.append(value)
        
        if failed != []:
            for failure in failed:
                self.collection.find_one_and_update({"_id": failure["_id"]}, {"$set": {"status": str(failure["status"])}})
        if succeeded != []:
            for success in succeeded:
                self.collection.find_one_and_update({"_id": success["_id"]}, {"$unset": {"status": ""}})

    """
    Header: helper function to update one receipt
    params: data: a single json object that contains 
    return: none
    """ 
    def updateOneReceipt(self, data):
        if "status" in data:
            self.collection.find_one_and_update({"_id": data["_id"]}, {"$unset": {"status": ""}})
        else:
            self.collection.find_one_and_update({"_id": data["_id"]}, {"$set": {"status": str(data["status"])}})
            
    """
    Header: function to update the status of a receipt in the database
    params: Either:
                a json object (basically a python dictionary) that contains a TXID and a Hash
                    Ex. {"TXID": ..., "_id": ...}
                a json object that contains a TXID and a failed status
                    Ex. {"_id": ..., "status": "failed"}
                a list of json objects that contain a TXID or a failed status, and a hash
    return: none
    """        
    def updateReceipts(self, data):
        if type(data) == list:
            self.updateManyReceipts(data)
        else:
            self.updateOneReceipt(data)
            
    """
    Header: function to get the status of a receipt in the database
    params: data: a json object that contains a hash
    return: a json object that contains the status of the receipt
    """
    def getStatus(self, data):
        query = self.collection.find_one({"_id": data["_id"]})
        if "status" in query:
            return {"status": query["status"]}
        else:
            return {"status": "success"}
        
    """
    Header: function to get all pending receipts in the database
    params: none
    return: a list of json objects that contain the status of the receipt
    """
    def getPending(self):
        query = self.collection.find({"status": {"$exists": True}})
        return query
