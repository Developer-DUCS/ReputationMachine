# ReputationMachine

The ReputationMachine project is a capstone project at Drury University (2022-2023). The purpose of the Reputation Machine is to make a system that facilitates making better [reputation system](https://en.wikipedia.org/wiki/Reputation_system#:~:text=Reputation%20systems%20are%20programs%20or,to%20build%20trust%20through%20reputation). When building a typical reputation system, all users must trust a central authority to manage and moderate the system. This means reputation systems are inherently vulnerable to being manipulated by those who run them. The goal of the Reputation Machine is to move this trust from a central authority into the technology that makes the system work. The Reputation Machine accomplishes this goal by using a distributed network to share reputation information as well as relying on blockchain technology to help verify the legitimacy of the information that is being shared.

## Poster

As part of this project, we submitted a poster to the Consortium for Computer Science in Colleges where we won second place. This poster gives a good overview of our project, and how it works.

![Building Better Reputation Systems: Using decentralized systems to trustlessly manage reputation](./images/Reputation-Machine-Poster.png)

## Starting the Reputation Machine

Starting the Reputation Machine requires running several process. The Reputation Machine consists of several sub systems that all must be running. The following need to be running to have a node of the reputation machine function properly.

1. Run mongodb - Run mongodb on the local machine on the default port of 27017.
2. Start rep_ent.py by running `python3 rep_ent.py -s`
3. Start the third party app subsytem by running `node ./3app-Subsystem/3rd_app_SS.js`
4. Start the network subsystem by running `node ./Network-Subsystem/server.js`

Each of these subsystems are responsible for some of the functionality of the Reputation Machine. Several of these subsystems communicate using http requests to localhost. Each of these subsystems are discuessed in a seperate readme file in the relevant directory.
