// services/blockService.js

const { Web3 } = require('web3');
const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);

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
        const tx = await web3.eth.getTransaction(txHash);
        const receipt = await web3.eth.getTransactionReceipt(txHash);
  
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
  
    return categorized;
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
    transactions: convertBigIntToString(categorizedTransactions),
  };
};

module.exports = { getLatestBlockSummary };
