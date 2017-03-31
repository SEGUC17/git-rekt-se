const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

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
 * Connect to DB
 */

mongoose.connect(process.env.DB_URL);

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
      error: err.toString(),
    });
});


module.exports = app;
