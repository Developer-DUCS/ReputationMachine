// File: printError.js
// Author: Julian Fisher
// Date: 1/21/2023
// Description: Print error messages to the console

// print an error message to the console
function printErrorMessage(message){
    console.error("\x1b[31m%s\x1b[0m", "ERROR: " + message);
}

module.exports = printErrorMessage;