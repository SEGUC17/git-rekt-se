const express = require('express');
const bodyParser = require('body-parser');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;
const Client = require('../../../../models/client/Client');
const Strings = require('../../../../services/shared/Strings.js');
const errorHandler = require('../../../../services/shared/errorHandler');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const router = express.Router();

/**
 * Express Validator.
 */

router.use(expressValidator({}));

router.use(bodyParser.json());

router.post('/delete/:id', AdminAuth, (req, res, next) => {
  Client.find({
    _id: req.params.id,
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    result._deleted = true;
    return res.json({
      message: Strings.adminSuccess.clientDeleted,
    });
  });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
