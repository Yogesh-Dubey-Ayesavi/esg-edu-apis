const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // Require dotenv at the top of your file
const GitMethods = require("./method");
const app = express();
const port = 3000;

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Define a POST route
app.post('/api', async (req, res) => {
  try {
    // Access the request body and query parameters
    const body = req.body;
    const queryParameters = req.query;
    
    // Retrieve GitHub Personal Access Token from environment variable
    const token =  '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'

    // Create an instance of GitMethods
    const instance = new GitMethods(token, queryParameters, body);

    // Call the asynchronous method and wait for the result
    const result = await instance.callMethod();

    // Send a response
    res.status(200).json( result );
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
