const express = require('express');
const logger = require('morgan');

const app = express();

/**
 * Load Enviroment variables from .env file
 */

require('dotenv')
  .config();

/**
 * DEBUG MODE MIDDLEWARES
 */

if (process.env.DEBUG_MODE) {
  app.use(logger('dev'));
}

/**
 * API ROUTES
 */

require('./routes/routes')(app);

/**
 * Generic Error Handling Middlewares.
 */

app.use((err, req, res, next) => {
  res.status(500)
    .json({
      message: err.toString(),
    });
});


module.exports = app;
