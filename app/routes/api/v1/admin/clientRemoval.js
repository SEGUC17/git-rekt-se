const express = require('express');
const bodyParser = require('body-parser');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;
const Client = require('../../../../models/client/Client');
const Strings = require('../../../../services/shared/Strings.js');
const errorHandler = require('../../../../services/shared/errorHandler');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const validator = require('../../../../services/shared/validation');

mongoose.Promise = Promise;

const router = express.Router();

/**
 * Express Validator.
 */

router.use(expressValidator({}));

router.use(bodyParser.json());

router.get('/delete/:id', AdminAuth, (req, res, next) => {
  req.checkParams(validator.adminClientValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Client.findOne({
          _id: req.params.id,
        }, (err, client) => {
          if (err) {
            return next(err);
          }
          client._deleted = true;
          client.save();
          return res.json({
            message: Strings.adminSuccess.clientDeleted,
          });
        });
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
