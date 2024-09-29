// config/web3.js

const { Web3 } = require('web3');
require('dotenv').config();

// Initialize Web3 with Infura
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const web3 = new Web3(`https://mainnet.infura.io/v3/${infuraProjectId}`);
module.exports = web3;