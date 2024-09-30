// routes/contractRoutes.js

const express = require('express');
const contractController = require('../controllers/contractController');
const { getLatestBlockSummary, getBlocksSummary } = require('../controllers/blockController');
const router = express.Router();

// Route to get the most recent smart contract
router.get('/latest-contract', contractController.getLatestContract);
router.get('/latest-block', getLatestBlockSummary);
// Route to get the last X blocks summary
router.get('/blocks', getBlocksSummary);

module.exports = router;