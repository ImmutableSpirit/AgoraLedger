// models/block.js
const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    baseFeePerGas: { type: String, required: true },
    blobGasUsed: { type: String, required: true },
    difficulty: { type: String, required: true },
    excessBlobGas: { type: String, required: true },
    extraData: { type: String, required: true },
    gasLimit: { type: String, required: true },
    gasUsed: { type: String, required: true },
    logsBloom: { type: String, required: true },
    miner: { type: String, required: true },
    mixHash: { type: String, required: true },
    nonce: { type: String, required: false },
    number: { type: String },
    hash: { type: String, required: true },
    parentHash: { type: String, required: true },
    receiptsRoot: { type: String, required: true },
    sha3Uncles: { type: String, required: true },
    size: { type: String, required: true },
    stateRoot: { type: String, required: true },
    totalDifficulty: { type: String, required: true },
    transactions: { type: [String], required: true } // Array of transaction hashes    
});

// Create the model from the schema
const Block = mongoose.model('Block', blockSchema);

// Export the model
module.exports = Block;
