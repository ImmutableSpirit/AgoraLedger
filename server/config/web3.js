// config/web3.js

const { Web3 } = require('web3');
const infuraUrl = 'https://mainnet.infura.io/v3/28452fe0d41d45a79526f4b1a340d161';

// Initialize Web3 with Infura
const web3 = new Web3('https://mainnet.infura.io/v3/28452fe0d41d45a79526f4b1a340d161');

module.exports = web3;