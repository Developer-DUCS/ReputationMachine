// File: generateMessage.js
// Author: Julian Fisher
// Date: 02/24/2023
// Description: Generate messages used to test the network subsystem

const {spawn} = require('child_process');


function generateShareReceiptMessage() {
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    }

    spawn('python',['receipts.py'])
}

generateShareReceiptMessage()