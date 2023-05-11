// © Drury University 2023

const generate = require("./receipt_demo");

function verify_receipt(receipt) {

    console.log(receipt)

    if(check_size(receipt) === true) {
        console.log("Passed receipt size check.")
        if(check_null(receipt) === true) {
            console.log("Passed source and target verification")
            if(check_claim(receipt.claim) === true) {
                console.log("Passed claim verification.")
                console.log("Receipt verified.")
                return true
            }
            else {
                console.log("Failed claim verification.")
                return false
            }
        }
        else {
            console.log("Failed source and target verification")
            return false
        }
    }
    else {
        console.log("Failed receipt size check.")
        return false
    }
}

verify_receipt(generate.random_receipt())

function check_size(receipt) {
    // Expected length is 3 for the size of a receipt
    // Source, target, and claim lengths should be 1, 1, and 4 respectively
    let size = Object.keys(receipt).length
    let source_size = Object.keys(receipt.source).length
    let target_size = Object.keys(receipt.target).length
    let claim_size = Object.keys(receipt.claim).length

    if(size != 3 || source_size != 1 || target_size != 1 || claim_size != 4) {
        return false
    }
    else {
        return true
    }
}

function check_null(receipt) {
    if(receipt.source.id != null && receipt.target.id != null) {
        return true
    }
    else {
        return false
    }
}

function check_claim(claim) {
    let types = ["Creation", "Modification", "Deletion"]
    let categories = ["Rating", "Review"]
    let valid_rating = [1, 2, 3, 4, 5]

    if(claim.id != null) {
        if(types.includes(claim.type) === true) {
            if(claim.type === "Deletion") {
                if(claim.category === null && claim.content === null) {
                    return true
                }
                else {
                    console.log("Invalid deletion request format.")
                    return false
                }
            }
            else {
                if(categories.includes(claim.category)) {
                    if(claim.content != null) {
                        if(typeof claim.content === "string") {
                            return true
                        }
                        else if(valid_rating.includes(claim.content)) {
                            return true
                        }
                        else {
                            console.log("Unknown claim content.")
                            return false
                        }
                    }
                }
                else {
                    console.log("Unknown claim category.")
                    return false
                }
            }
        }
        else {
            console.log("Improper claim category or type.")
            return false
        }
    }
    else {
        console.log("Invalid claim id.")
        return false
    }

}

//quick dirty verification of verify_receipt method, comment out all console.logs with replace all except for the ones in the metthod, or don't.
function test() {

    let num_tests = 100
    let check_passes = 0
    let check_fails = 0
    for(let i = 0; i < num_tests; i++) {
        if(verify_receipt() === true) {
            check_passes += 1
        } 
        else {
            check_fails += 1
        }
    }
    console.log("Tests Passed: " + check_passes)
    console.log("Tests Failed: " + check_fails)
}