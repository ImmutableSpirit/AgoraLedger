// services/blockService.js

const { Web3 } = require('web3');
const infuraUrl = 'https://mainnet.infura.io/v3/28452fe0d41d45a79526f4b1a340d161';
const web3 = new Web3('https://mainnet.infura.io/v3/28452fe0d41d45a79526f4b1a340d161');

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

// Function to categorize transactions
const categorizeTransactions = async (transactions) => {
  const categorized = {
    etherTransfers: [],
    contractCreations: [],
    contractCalls: [],
  };

  for (const txHash of transactions) {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      if (!tx.to) {
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
    transactions: convertBigIntToString(categorizedTransactions),
  };
};

module.exports = { getLatestBlockSummary };
