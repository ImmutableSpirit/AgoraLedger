const express = require('express');
const cors = require('cors');
const contractRoutes = require('./routes/contractRoutes'); // Import the contract routes
const app = express();
const port = 3000;

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

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
