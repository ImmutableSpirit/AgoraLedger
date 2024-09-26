// services/contractService.js

const web3 = require('../config/web3');

// Service to get the most recent smart contract
exports.getLatestContract = async () => {
  try {
    const latestBlock = await web3.eth.getBlock('latest');
    const transactions = latestBlock.transactions;

    for (const txHash of transactions) {
      const tx = await web3.eth.getTransaction(txHash);
      console.log('Transaction:', tx);
      if (!tx.to) {
        return tx;  // Return the first contract creation transaction found
      }
    }
    return null;  // No contract creation found
  } catch (error) {
    throw new Error('Error fetching latest contract');
  }
};
