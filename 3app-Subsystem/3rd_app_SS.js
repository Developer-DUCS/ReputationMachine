const express = require('express');
const bodyParser = require('body-parser');
const { type } = require('os');
const app = express();

const CTRL_PORT = 3030;
const PORT = 3000;
// const KEY_CHECK = 'MIIBCgKCAQEA';
// const CHECK_LENGTH = KEY_CHECK.length;
// const KEY_LENGTH = 360;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function validSource(source) {

    if (typeof source == 'string') {
        return true;
    }
    else {
        return false;
    }

    // if (typeof source == 'string' && source.length === KEY_LENGTH && source.substring(0, CHECK_LENGTH) === KEY_CHECK) {
    //     return true;
    // }
    // else {
    //     return false;
    // }
}

function validTarget(target) {

    if (typeof target == 'string') {
        return true;
    }
    else {
        return false;
    }

    // if (typeof target == 'string' && target.length === KEY_LENGTH && target.substring(0, CHECK_LENGTH) === KEY_CHECK) {
    //     return true;
    // }
    // else {
    //     return false;
    // }
}

function validClaim(claim) {
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
    if(validSource(receipt.source) && validTarget(receipt.target) && validClaim(receipt.claim)) {
        return true
    }
    else {
        return false;
    }
    
}

function validHash(hashObject) {
    let sha256Pattern = /^[0-9a-fA-F]{64}$/;

    if(typeof hashObject == 'string' && sha256Pattern.test(hashObject)) {
        return true;
    }
    return false
}

async function fetchRoute(args, route) {
    let url = `http://127.0.0.1:${CTRL_PORT}/${route}`;

    let options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(args)
    }

    let result = await fetch(url, options);

    if(result.status === 200) {
        let final = await result.json();
        return(final);
    }
    else {
        return(`Failed to process request, ${route}, given ${args}, on route ${url}`)
    }
}

app.post('/createReceipt', async (req, res) => {
    if(verifyReceipt(req.body)) {
        let result = await fetchRoute(req.body, 'createReceipt');
        res.send(result);
    }
    else{
        res.send(`${JSON.stringify(req.body)} - Receipt is invalid!`);
    }
});

app.get('/getReceipts/:id', async (req, res) => { 
    let url_target = req.params['id'];

    if(url_target != 'source' && url_target != 'target') {
        res.send('Invalid url, only /source and /target are valid!');
    }
    else {
        let request = req.body;
        if(url_target == 'source') {
            if(request.source == undefined) {
                res.send("Mismatch between url parameter and request body!")
            }
            else if(validSource(request.source) != true) {
                res.send('Invalid source id!');
            }
            else {
                let result = await fetchRoute(request, '/getReceipts');
                res.send(result);
            }
        }
        else if(url_target == 'target') {
            if(request.target == undefined) {
                res.send("Mismatch between url parameter and request body!")
            }
            else if(validTarget(request.target) != true) {
                res.send(`${JSON.stringify(request)} - Invalid target id!`);
            }
            else {
                let result = await fetchRoute(request, '/getReceipts');
                res.send(result);
            }
        }
    }

});

app.get('/embedStatus', async (req, res) => { 
    if(validHash(req.body['_id']) != true) {
        res.send(`${JSON.stringify(req.body)} - Invalid hash!`)
    }
    else {
        let result = await fetchRoute(req.body, 'embedStatus');
        if(result === {}) {
            res.send('No receipt found with that hash!');
        }
        else {
            res.send(result);
        }
    }
});

app.get('*', (req, res) => {
    res.send('Invalid url!');
});

app.listen(PORT, () => {
    console.log(`App listening at http://127.0.0.1:${PORT}`);
});