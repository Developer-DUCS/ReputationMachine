# 3rd Party App Subsystem API Guide

Running: 127.0.0.1(localhost)
Port: 3000

Available Routes:
/createReceipt
/getReceipts/:id (id parameter takes only source or target)
/embedStatus

## /createReceipt - Route Information:

Expects a request body in JSON of a receipt in the following format:
```
{
	"source": {
		"id": valid public key
	}
	"target": {
		"id": valid public key
	}
	"claim": {
		"id": valid uuid4,
		"type": "Creation" or "Modification" or "Deletion",
		"category": "Rating" or "Review" or null in case "type": "Deletion",
		"content": 1-5 in case "category": "Rating" or string in case "category": "Review" or null in case "type": "Deletion"
	}
}
```

All receipts will be checked if they meet the requirements, if they fail any of the tests the request body is returned as a response with an invalid message.

## /getReceipts/:id - Route Information:

Expects a request body in JSON of the source or a target in the following format:

```
{
	"source" or "target": {
		"id": valid public key
	}
}
```

If the url :id is not target or source, an invalid route respsonse will be sent back.
All source and targets will be checked for valid public key parameters, if they fail any of the tests the request body is returned as a response with an invalid message.

## /embedStatus - Route Information:

```
Expects a request body in JSON of a receipt hash in the following format:
{
	"hash": valid sha256 hash
}
```

The hash must be a valid sha256 hash to pass the validation tests, if it fails the request body is returned as a response with an invalid message.
