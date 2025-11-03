// Simple Node.js server for Render deployment
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle client-side routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 RG Interiors website is running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});
