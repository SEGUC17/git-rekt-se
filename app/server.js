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
 * Https Options.
 */

const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem')),
  key: fs.readFileSync(path.join(__dirname, './certs/key.pem')),
};

/**
 * Start http and https servers.
 */

app.listen(port, () => console.log(`Server started.\nListening on ports ${port} and ${httpsPort}.`));
https.createServer(httpsOptions, app).listen(httpsPort);
