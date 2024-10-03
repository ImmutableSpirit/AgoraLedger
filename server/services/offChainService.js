// server/services/offChainService.js

require('dotenv').config();
const { Web3 } = require('web3');
const mongoose = require('mongoose');
const Block = require('../models/block');  // Adjust the path if necessary

// Setup Web3.js connection
const web3 = new Web3(process.env.INFURA_URL);

// Function to fetch and save the latest block
async function fetchLatestBlock() {
    try {
        const latestBlockNumber = await web3.eth.getBlockNumber();
        const block = await web3.eth.getBlock(latestBlockNumber);

        const blockNumber = block.number.toString();

        // Ensure timestamp is a valid Date
        const blockTimestamp = new Date(Number(block.timestamp.toString()) * 1000); // Convert Unix timestamp to milliseconds

        const existingBlock = await Block.findOne({ number: blockNumber });
        if (!existingBlock) {
            const newBlock = new Block({
                timestamp: blockTimestamp,
                baseFeePerGas: block.baseFeePerGas ? block.baseFeePerGas.toString() : "0", // Handle possible absence
                blobGasUsed: block.blobGasUsed ? block.blobGasUsed.toString() : "0", // Handle possible absence
                difficulty: block.difficulty ? block.difficulty.toString() : "0", // Handle possible absence
                excessBlobGas: block.excessBlobGas ? block.excessBlobGas.toString() : "0", // Handle possible absence
                extraData: block.extraData || "", // Default to an empty string if missing
                gasLimit: block.gasLimit.toString(),
                gasUsed: block.gasUsed.toString(),
                logsBloom: block.logsBloom || "", // Default to an empty string if missing
                miner: block.miner || "", // Default to an empty string if missing
                mixHash: block.mixHash || "", // Default to an empty string if missing
                nonce: block.nonce || "", // Default to an empty string if missing
                number: blockNumber,
                hash: block.hash,
                parentHash: block.parentHash || "", // Default to an empty string if missing
                receiptsRoot: block.receiptsRoot || "", // Default to an empty string if missing
                sha3Uncles: block.sha3Uncles || "", // Default to an empty string if missing
                size: block.size ? block.size.toString() : "0", // Handle possible absence
                stateRoot: block.stateRoot || "", // Default to an empty string if missing
                totalDifficulty: block.totalDifficulty ? block.totalDifficulty.toString() : "0", // Handle possible absence
                transactions: block.transactions || [] // Array of transaction hashes
            });
            await newBlock.save();
            console.log(`Block ${block.number} saved successfully.`);
            console.log('=========================');
            console.log(block);
        } else {
            console.log(`Block ${block.number} already exists.`);
        }
    } catch (err) {
        console.error('Error fetching or saving block:', err);
    }
}


// Start periodic fetching
function startBlockFetching(interval) {    
    if (interval > 8000) {
        fetchLatestBlock();  // Run immediately if the interval is at least 8 seconds
    }
    setInterval(async () => {
        console.log('Fetching latest block...');
        await fetchLatestBlock();
    }, interval);
}

module.exports = { fetchLatestBlock, startBlockFetching };
