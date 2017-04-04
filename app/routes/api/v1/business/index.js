const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const businessAuthMiddleware = require('../../../../services/shared/jwtConfig').businessAuthMiddleware;
const Service = require('../../../../models/service/Service');

const router = express.Router();
mongoose.Promise = Promise;

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Category CRUD routes
 */

/**
 * Business create a service
 */

router.post('/service/create', businessAuthMiddleware, (req, res, err) => {

});

/**
 * Error handling Middlewares
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});


module.exports = router;
