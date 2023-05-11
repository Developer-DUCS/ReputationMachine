// © Drury University 2023

const crypto = require("crypto");
const fs = require("fs")
const getRandomValues = require('get-random-values')

function generate_key_pair() {
    const {publicKey, privateKey} =
    crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });

    const exported_pubkey_buffer = publicKey.export({
        type: "pkcs1", 
        format: "pem",
    });
    fs.writeFileSync("target_public.pem", exported_pubkey_buffer, {encoding: "utf-8"})

    const exported_privkey_buffer = privateKey.export({
        type: "pkcs1",
        format: "pem",
    });
    fs.writeFileSync("target_private.pem", exported_privkey_buffer, {encoding: "utf-8"})
}

function random_receipt() {

    let source_public_key = fs.readFileSync("source_public.pem", "utf-8")
    let target_public_key = fs.readFileSync("target_public.pem", "utf-8")

    source_public_key = source_public_key.replace(/\n/g, '')
    target_public_key = target_public_key.replace(/\n/g, '')

    let claim_id = uuid4()

    temp = {
        "source": {
            "id": source_public_key
        },
        "target": {
            "id": target_public_key
        },
        "claim": random_claim(claim_id)
    }

    return(temp)
}

function random_claim(claim_id) {
    let types = ['Creation', 'Modification', 'Deletion']
    let content_types = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus felis quis dapibus pretium. Donec eget augue id leo mattis facilisis. Duis ut lacus ac orci mattis consectetur ac id tellus.', 'Vivamus leo velit, condimentum eu nunc eget, lacinia ultricies urna. Integer semper, libero eu dignissim luctus, turpis lacus fringilla sapien, et porttitor diam nunc vitae nunc.', 'Morbi aliquam elit eu urna accumsan ultricies. Phasellus non tellus eget magna pharetra vestibulum commodo eget est.']
    var type = types[Math.floor(Math.random()*types.length)]
    var choice = Math.floor(Math.random() * 2) + 1

    if(type === 'Deletion') {
        temp = {
            "id": claim_id,
            "type": type,
            "category": null,
            "content": null
        }
    }
    else {
        if(choice === 1) {
            var category = "Review"
            var content = content_types[Math.floor(Math.random()*content_types.length)]
        }
        else {
            var category = "Rating"
            var content = Math.floor(Math.random() * 5) + 1
        }
        temp = {
            "id": claim_id,
            "type": type,
            "category": category,
            "content": content
        }
    }

    return(temp)
}

function uuid4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

module.exports = {
    random_receipt
}