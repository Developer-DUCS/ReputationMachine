# ReputationMachine

The ReputationMachine project is a capstone project at Drury University (2022-2023). The purpose of the Reputation Machine is to make a system that facilitates making better [reputation system](https://en.wikipedia.org/wiki/Reputation_system#:~:text=Reputation%20systems%20are%20programs%20or,to%20build%20trust%20through%20reputation). When building a typical reputation system, all users must trust a central authority to manage and moderate the system. This means reputation systems are inherently vulnerable to being manipulated by those who run them. The goal of the Reputation Machine is to move this trust from a central authority into the technology that makes the system work. The Reputation Machine accomplishes this goal by using a distributed network to share reputation information as well as relying on blockchain technology to help verify the legitimacy of the information that is being shared.

## Poster

As part of this project, we submitted a poster to the Consortium for Computer Science in Colleges where we won second place. This poster gives a good overview of our project, and how it works.

![Building Better Reputation Systems: Using decentralized systems to trustlessly manage reputation](./images/Reputation-Machine-CCSC-Poster.jpg)

## Starting the Reputation Machine

Starting the Reputation Machine requires running several process. The Reputation Machine consists of several sub systems that all must be running. The following need to be running to have a node of the reputation machine function properly.

1. Install Python dependencies via `pip3 install -r requirements.txt`
2. Run mongodb - Run mongodb on the local machine on the default port of 27017.
3. Start rep_ent.py by running `python3 rep_ent.py -s`
4. Start the third party app subsytem by running `node ./3app-Subsystem/3rd_app_SS.js`
5. Start the network subsystem by running `node ./Network-Subsystem/server.js`

Each of these subsystems are responsible for some of the functionality of the Reputation Machine. Several of these subsystems communicate using http requests to localhost. Each of these subsystems are discuessed in a seperate readme file in the relevant directory.

## API

Prior embedding, Receipt Structure 1 (RS1):

```
{
  "source": ECDSA, P-256 Public Key,
  "target": ECDSA, P-256 Public Key,
  "claim": {
    "id": uuid4,
    "type": string containing Creation, Deletion, or Modification,
    "category": string containing Review or Rating,
    "content": 1-5 if rating, sring if review
  }
}
```

Post embedding, Receipt Structure 2 (RS2):

```
{
  "_id": SHA-256 Hash,
  "source": ECDSA, P-256 Public Key,
  "target": ECDSA, P-256 Public Key,
  "claim": {
    "id": uuid4,
    "type": string containing Creation, Deletion, or Modification,
    "category": string containing Review or Rating,
    "content": 1-5 if rating, sring if review
  },
  "txid": valid blockchain transaction id,
  "fingerprint": signature of receipt using private key
}
```

### /verifyReceipt

Used by the network subsystem to verify a receipt received when requesting a receipt from network peers, expects RS2 format and returns either "True" or "False" depending on the receipt's validity.

### /saveReceipt

Used by the network subsytem to save a valid RS2 formatted receipt when received from network peers.

### /createReceipt

Used by the 3rd party app subsystem to create receipts. Expects a valid RS1 formatted and appends the "_id" field, generates the fingerprint and embeds the fingerprint into the blockchain, and finally adds the resulting txid to the receipt. Following the successful execution of all these operations, the receipt is added to the mongoDB database with a pending status until the scheduled task executes and returns six confirmations of the fingerprint in the blockchain, after which the pending status is removed.

### /getReceipts

Used by the 3rd party app subsystem to request receipts from or about a specific participant in the network. Expects a valid JSON source or target object and returns all receipts found from or about that entity.

```
{
  "source": ECDSA, P-256 Public Key
}

OR

{
  "target": ECDSA, P-256 Public Key
}
```

### /retrReceipts

Used by the network subsystem to retrieve receipts from their own mongoDB database. Uses the same structure as the /getReceipts route.

### /embedStatus

Used by the 3rd party app subsystem to query the database to see if a receipt has been successfully embedded into the blockchain, expects a JSON object containing a valid "_id" field.

```
{
  "_id": SHA-256 Hash
}
```
