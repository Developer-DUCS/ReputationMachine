const createClient = require('./ReputableEntity/socket_client');
const initCommandLine  = require('./ReputableEntity/serverCommands');

function removeClientFromList(clientURL){
    myClients = myClients.filter(function(client){
        return client.url != clientURL
    });
}

function addClientToList(client){
    myClients.append(client);
}

initCommandLine(myClients,sockServ);

module.exports = removeClientFromList
module.exports = addClientToList