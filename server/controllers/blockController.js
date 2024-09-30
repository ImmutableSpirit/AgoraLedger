// controllers/blockController.js

const { getLatestBlockSummary, getBlocksSummary } = require('../services/blockService');

exports.getLatestBlockSummary = async (req, res) => {
  try {
    const summary = await getLatestBlockSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching the latest block:', error);
    res.status(500).json({ error: 'Error fetching the latest block' });
  }
};

exports.getBlocksSummary = async (req, res) => {
  const { numBlocks } = req.query; // Get the number of blocks from the query parameter
  try {
    const summary = await getBlocksSummary(parseInt(numBlocks, 10) || 5); // Default to 5 blocks if not provided
    res.json(summary);
  } catch (error) {
    console.error('Error fetching blocks summary:', error);
    res.status(500).json({ error: 'Error fetching blocks summary' });
  }
};