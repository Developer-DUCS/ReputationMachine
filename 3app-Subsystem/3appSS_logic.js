// © Drury University 2023





// will eventually compose of checking to see if the source is a valid public key
function validSource(source) {
    if (typeof source.id == 'string' && source.id.length === KEY_LENGTH && source.id.substring(0, CHECK_LENGTH) === KEY_CHECK) {
        return true;
    }
    else {
        return false;
    }
}

// will eventually compose of checking to see if the target is a valid public key
function validTarget(target) {
    if (typeof target.id == 'string' && target.id.length === KEY_LENGTH && target.id.substring(0, CHECK_LENGTH) === KEY_CHECK) {
        return true;
    }
    else {
        return false;
    }
}

function validClaim(claim) {
    // initial check, will be reformatted to check if claim id 
    if (typeof claim.id == 'string' && typeof claim.type == 'string') {
        if (claim.type == 'Deletion') {
            if (claim.category == null && claim.content == null) {
                return true;
            }
            else {
                return false;
            }
        }
        if (claim.category == 'Rating') {
            if (typeof claim.content == 'number' && claim.content >= 0 && claim.content <= 5) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (claim.category == 'Review') {
            if (typeof claim.content == 'string') {
                return true;
            }
            else {
                return false;
            }
        }
    }
    else {
        return false;
    }
}

function verifyReceipt(receipt) {
    /*
    Valid receipt composes of the following value:
    {
        "source": {
            "string"
        },
        "target": {
            "string"
        },
        "claim": {
            "id": "string",
            "type": "string",
            "category": "string" or null,
            "content": "string" or integer or null,
        }
    }
    */
    if(validSource(receipt.source) && validTarget(receipt.target) && validClaim(receipt.claim)) {
        return true
    }
    else {
        return false;
    }
    
}

function validHash(hashObject) {

    //regex to check if the hash is a valid length(64) and only contains hex characters
    let sha256Pattern = /^[0-9a-fA-F]{64}$/;

    if(typeof hashObject.hash == 'string' && sha256Pattern.test(hashObject.hash)) {
        return true;
    }
    return false
}

async function createReceipt(receipt){
    let options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(receipt)
    }

    let result = await fetch(`http://127.0.0.1:${CTRL_PORT}/3app/createReceipt`, options);

    if(result.status === 200) {
        let final = await result.json();
        return(final);
    }
    else {
        return('Creation failed!')
    }
}

async function getReceiptByHash(hash) {
    let options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(hash)
    }

    let result  = await fetch(`http://127.0.0.1:${CTRL_PORT}/3app/embedStatus`, options);
    if(result.status === 200) {
        let final = await result.json();
        return(final);
    }
    else {
        return(`Failed to find receipt with hash ${hash}!`)
    }

}

async function getReceiptsById(id) {
    let options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(id)
    }

    let result  = await fetch(`http://127.0.0.1:${CTRL_PORT}/3app/getReceipts`, options);
    if(result.status === 200) {
        let final = await result.json();
        return(final);
    }
    else {
        return(`Failed to get receipts for ${id}!`)
    }
}