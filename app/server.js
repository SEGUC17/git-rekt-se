/**
 * Load Enviroment variables from .env file
 */

require('dotenv')
  .config();

/**
 * Require express main app
 */

const app = require('./app');

const port = process.env.PORT;

/**
 * Start server
 */

app.listen(port, () => console.log('Server started.\nListening on port 3000.'));
