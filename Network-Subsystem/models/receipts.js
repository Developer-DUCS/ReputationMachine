// © Drury University 2023
const mongoose = require('mongoose');

const receipt = new mongoose.Schema(
    {
        hash: {type: String, required: true},
        txid: {type: String, required: true},
        receipt: {
            source: {type: String, required: true},
            target: {type: String, required: true},
            claim: {
                id: {type: String, required: true},
                type: ['creation','modification','deletion'],
                category: ['review','rating'],
                content: String
            }
        }
    }
);

module.exports = receipt;