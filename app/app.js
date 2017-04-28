const express = require('express');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');

const jwtConfig = require('./services/shared/jwtConfig');
const fbConfig = require('./services/shared/fbConfig');

const app = express();
/**
 * Load Enviroment variables from .env file.
 */

require('dotenv')
  .config();

/**
 * Helmet Security.
 */
app.use(helmet());

/**
 * DEBUG MODE MIDDLEWARES.
 */

if (process.env.DEBUG_MODE) {
  app.use(logger('dev'));

  /**
   * Add Delay to test frontend.
   */

  if (process.env.ADD_DELAY) {
    app.use((req, res, next) => {
      const delay = Math.floor(((Math.random() * 500) + 300));
      setTimeout(next, delay);
    });
  }
}

/**
 * Connect to DB.
 */

mongoose.connect(process.env.DB_URL);

/**
 * Passport Initialization.
 */

passport.use('jwt_client', jwtConfig.clientStrategy);
passport.use('jwt_bussiness', jwtConfig.businessStrategy);
passport.use('jwt_administrator', jwtConfig.adminStrategy);
passport.use('facebook_strategy', fbConfig.facebookStrategy);

app.use(passport.initialize());


/**
 * API ROUTES.
 */

require('./routes/routes')(app);

/**
 * G-Zip assets compression.
 */

app.use(compression());

/**
 * Frontend Routes.
 */

app.use(express.static(path.join(__dirname, '../public/dist/assets'), { maxAge: 604800 }));

app.get('/*', (req, res) => res.redirect(`/#${req.originalUrl}`));

/**
 * Generic Error Handling Middlewares.
 */

app.use((err, req, res, next) => {
  res.status(500)
    .json({
      error: 'An error occurred with the server.',
    });
});


module.exports = app;
