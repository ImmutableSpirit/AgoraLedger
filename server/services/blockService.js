// services/blockService.js

const { Web3 } = require('web3');
require('dotenv').config();

const infuraProjectId = process.env.INFURA_PROJECT_ID;
const web3 = new Web3(`https://mainnet.infura.io/v3/${infuraProjectId}`);

// Helper function to recursively convert BigInt properties to strings
const convertBigIntToString = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(convertBigIntToString);
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          return [key, typeof value === 'bigint' ? value.toString() : convertBigIntToString(value)];
        })
      );
    }
    return obj;
  };

  const categorizeTransactions = async (transactions) => {
    const categorized = {
      etherTransfers: [],
      contractCreations: [],
      contractCalls: [],
    };

    console.log("# of transactions: " + transactions.length);
  
    for (const txHash of transactions) {
      try {
        const tx = await retryWithDelay(() => web3.eth.getTransaction(txHash));
        const receipt = await retryWithDelay(() => web3.eth.getTransactionReceipt(txHash));
  
        if (receipt.contractAddress || tx.to === null || tx.to === '0x0') {
          categorized.contractCreations.push({
            ...tx,
            contractAddress: receipt.contractAddress || "none",
          });
        } else if (tx.input !== '0x') {
          categorized.contractCalls.push(tx);
        } else {
          categorized.etherTransfers.push(tx);
        }
      } catch (error) {
        console.error(`Error fetching transaction ${txHash}:`, error);
      }
    }

    console.log("# of creations: " + categorized.contractCreations.length);
    console.log("# of calls: " + categorized.contractCalls.length);
    console.log("# of transfers: " + categorized.etherTransfers.length);
  
    return convertBigIntToString(categorized);
  };

// Function to categorize transactions
const categorizeTransactions2 = async (transactions) => {
  const categorized = {
    etherTransfers: [],
    contractCreations: [],
    contractCalls: [],
  };

  console.log("# of transactions: " + transactions.length);

  for (const txHash of transactions) {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      if (tx.to === null || tx.to === '0x0') {
        categorized.contractCreations.push(tx);
      } else if (tx.input !== '0x') {
        categorized.contractCalls.push(tx);
      } else {
        categorized.etherTransfers.push(tx);
      }
    } catch (error) {
      console.error(`Error fetching transaction ${txHash}:`, error);
    }
  }

  console.log("# of creations: " + categorized.contractCreations.length);
  console.log("# of calls: " + categorized.contractCalls.length);
  console.log("# of transfers: " + categorized.etherTransfers.length);

  return categorized;
};

// Main function to get the latest block and categorize its transactions
const getLatestBlockSummary = async () => {
  const block = await web3.eth.getBlock('latest');
  const transactions = block.transactions;

  const categorizedTransactions = await categorizeTransactions(transactions);

  return {
    blockNumber: block.number.toString(),
    timestamp: block.timestamp.toString(),
    transactions: categorizedTransactions,
  };
};

// Fetch the last X blocks and categorize their transactions
const getBlocksSummary = async (numBlocks) => {
  const latestBlock = await web3.eth.getBlock('latest');
  const latestBlockNumber = Number(latestBlock.number);
  const blockPromises = [];

  // Fetch the last X blocks including the latest one
  for (let i = 0; i < numBlocks; i++) {
    const blockNumber = latestBlockNumber - i;
    blockPromises.push(retryWithDelay(() => web3.eth.getBlock(blockNumber, true)));
  }

  const blocks = await Promise.all(blockPromises);
  // Reverse the blocks array to have the oldest block first
  const reversedBlocks = blocks.reverse();
  
  // Process each block's transactions and categorize them
  const blocksSummary = await Promise.all(reversedBlocks.map(async (block) => {
    const categorizedTransactions = await categorizeTransactions(block.transactions.map(tx => tx.hash));

    return {
      timestamp: block.timestamp.toString(),
      contractCalls: categorizedTransactions.contractCalls,
      etherTransfers: categorizedTransactions.etherTransfers,
      contractCreations: categorizedTransactions.contractCreations
    };
  }));

  return blocksSummary;
};

// Retry logic with delay
const retryWithDelay = async (fn, retries = 5, delay = 800) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithDelay(fn, retries - 1, delay);
  }
};

module.exports = { getBlocksSummary, getLatestBlockSummary };
