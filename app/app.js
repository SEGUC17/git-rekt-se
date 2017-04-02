const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
<<<<<<< HEAD
const jwtConfig = require('./services/shared/jwtConfig.js');
=======
const jwtConfig = require('./services/shared/jwtConfig');
>>>>>>> 233bb1e7c49c72f0f6a809a4c7075409fb82917b

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
 * Passport Initialization
 */

passport.use('jwt_client', jwtConfig.clientStrategy);
passport.use('jwt_bussiness', jwtConfig.businessStrategy);
app.use(passport.initialize());

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
