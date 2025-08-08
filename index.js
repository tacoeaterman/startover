const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const path = require('path');

// Import your built server
const { default: createServer } = require('./dist/index-prod.js');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// API routes and server setup
createServer(app);

// Export the Express app as a Firebase Function
exports.app = onRequest(app);
