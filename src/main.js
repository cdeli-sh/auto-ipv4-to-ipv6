const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Some operations need elevated privileges, so we need sudo to run them.
const sudo = require('sudo-prompt');

// Import Nginx Configuration Handler

// Express configureation
const express = require('express');
const fs = require('fs');
const nginxConf = require('./nginxConf');

const app = express();
const port = 8000;

// Import file sent during configuration generation
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

// Catch all route, send index.html to the client while the configuration is generated
app.get('*', (req, res) => {
  res.send(html);
  nginxConf(req, sudo);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
