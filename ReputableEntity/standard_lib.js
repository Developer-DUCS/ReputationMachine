// File: server_commands.js
// Author: Julian Fisher
// Date: 1/21/2023
// Description: A standard library of functions to use in other files in this project.

// print an error message to the console
function printErrorMessage(message){
    console.error("\x1b[31m%s\x1b[0m", "ERROR: " + message);
}