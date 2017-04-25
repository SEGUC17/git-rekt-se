/**
 * Require express main app.
 */

const fs = require('fs');
const path = require('path');
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
  cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem')),
  key: fs.readFileSync(path.join(__dirname, './certs/key.pem')),
};

/**
 * Create http and https servers.
 */

app.listen(port, () => console.log('Server started.\nListening on port 3000.'));
https.createServer(httpsOptions, app).listen(httpsPort);
