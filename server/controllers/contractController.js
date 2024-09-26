// controllers/contractController.js

const contractService = require('../services/contractService');

// Controller for handling the most recent smart contract request
exports.getLatestContract = async (req, res) => {
  try {
    console.log("get latest contract..");
    const contract = await contractService.getLatestContract();
    console.log("got contract");
    if (contract) {
      // Convert BigInt fields to string to avoid serialization issues
      const contractFormatted = {
        ...contract,
        value: contract.value ? contract.value.toString() : null, // Example: converting BigInt value
        blockNumber: contract.blockNumber.toString() // Convert block number (BigInt) to string
      };

      console.log('First 100 characters of contractFormatted:', JSON.stringify(contractFormatted).substring(0, 100));

      res.json({ message: 'Most recent smart contract', contractFormatted });
    } else {
      res.json({ message: 'No contracts found in the latest block' });
    }
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'An error occurred while fetching the most recent contract' });
  }
};
