const express = require('express');
const cors = require('cors');
const contractRoutes = require('./routes/contractRoutes');
const mongoose = require('mongoose');
const { startBlockFetching } = require('./services/offChainService');  
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Start block fetching service at the configured interval
const fetchInterval = process.env.FETCH_INTERVAL || 30000;  // Default to 30 seconds
startBlockFetching(fetchInterval);

// Use the contract routes
app.use('/api/contracts', contractRoutes);

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World! Welcome to AgoraLedger!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();  // Close MongoDB connection
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0); // Exit process successfully
  });
};

// Listen for termination signals
process.on('SIGINT', shutdown);  // Ctrl+C
process.on('SIGTERM', shutdown);  // Termination signal
