// controllers/blockController.js

const { getLatestBlockSummary } = require('../services/blockService');

exports.getLatestBlockSummary = async (req, res) => {
  try {
    const summary = await getLatestBlockSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching the latest block:', error);
    res.status(500).json({ error: 'Error fetching the latest block' });
  }
};