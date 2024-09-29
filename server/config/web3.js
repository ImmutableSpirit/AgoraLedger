// config/web3.js

const { Web3 } = require('web3');

// Initialize Web3 with Infura
const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
module.exports = web3;