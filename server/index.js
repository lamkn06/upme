const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.resolve(__dirname, '../build')));

// Put all API endpoints under '/api
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`UpMe listening on ${port}`);