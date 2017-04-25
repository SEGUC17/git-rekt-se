/**
 * Require express main app.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const app = require('./app');

const port = process.env.PORT;
const httpsPort = process.env.HTTPS_PORT;

/**
 * Start server.
 */

/**
 * Https Options
 */
const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, './certs/fullchain.pem')),
  ket: fs.readFileSync(path.join(__dirname, './certs/privkey.pem')),
};

// app.listen(port, () => console.log('Server started.\nListening on port 3000.'));

http.createServer(app).listen(port);
https.createServer(httpsOptions, app).listen(httpsPort);
