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

/**
 * Change Mongoose Promise Library with the default one.
 */
mongoose.Promise = Promise;

const router = express.Router();

/**
 * Express Validator.
 */

router.use(expressValidator({}));

/**
 * Bodyparser Middleware.
 */
router.use(bodyParser.json());

/**
 * Admin Delete A Client API Route.
 * `id` is the Client's ID.
 * A Soft Delete is performed.
 */
router.post('/delete/:id', AdminAuth, (req, res, next) => {
  req.checkParams(validator.adminClientValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Client.findOne({
          _id: req.params.id,
        }).then((client) => {
          if (client && client.status === 'confirmed') {
            if (client._deleted) {
              next(Strings.adminFailures.clientAlreadyDeleted);
            } else {
              client._deleted = true;
              client.save().then(() => res.json({
                message: Strings.adminSuccess.clientDeleted,
              })).catch(e => next([e]));
            }
          } else {
            next(Strings.adminValidationErrors.invalidClientID);
          }
        }).catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 * Return a list of clients to delete.
 */

router.post('/list', AdminAuth, (req, res, next) => {
  Client.find({
    _deleted: false,
    status: 'confirmed',
  }, {
    firstName: true,
    lastName: true,
    email: true,
  }).then(clients => res.json({
    results: clients,
  })).catch(e => next(e));
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
