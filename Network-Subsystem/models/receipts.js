const mongoose = require('mongoose');

const receipt = new mongoose.Schema(
    {
        hash: 'string',
        txid: 'string',
        receipt: {
            source: 'string',
            target: 'string',
            claim: {
                id: 'string',
                type: ['creation','modification','deletion'],
                category: ['review','rating'],
                content: 'string'
            }
        }
    }
);

module.exports = receipt;