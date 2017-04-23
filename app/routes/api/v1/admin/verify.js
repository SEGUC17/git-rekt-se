const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const businessAuthenticator = require('../../../../services/business/BusinessAuthenticator');
const Business = require('../../../../models/business/Business');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;
const AdminValidator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const errorHandler = require('../../../../services/shared/errorHandler');

const router = express.Router();

/**
 * Change Mongoose Promise Library with the default one.
 */
mongoose.Promise = Promise;

/**
 * Bodyparser Middleware.
 */
router.use(bodyParser.json());

/**
 * Express Validator Middleware.
 */
router.use(expressValidator({}));

/**
 * Admin View all business application.
 */
router.post('/business', AdminAuth, (req, res, next) => {
  Business.find({
    _deleted: false,
    _status: 'unverified',
  })
    .exec()
    .then((businesses) => {
      if (businesses) {
        res.json(businesses);
      }
    })
    .catch(err => next(err));
});

/**
 * Admin Accepts the application of the business.
 * Send an email with token to continue signup.
 * `id` is the Business' ID.
 */
router.post('/confirm/:id', AdminAuth, (req, res, next) => {
  req.checkParams(AdminValidator.adminConfirmBusinessValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        const search = {
          _id: req.params.id,
          _deleted: false,
        };
        Business.findOne(search)
          .exec()
          .then((business) => {
            if (business) {
              if (!business) {
                next([Strings.businessMessages.businessDoesntExist]);
              } else if (business._status === 'pending') {
                next([Strings.businessConfirmation.pending]);
              } else if (business._status === 'rejected') {
                next([Strings.businessConfirmation.alreadyDenied]);
              } else if (business._status === 'verified') {
                next([Strings.businessConfirmation.alreadyConfirmed]);
              } else {
                businessAuthenticator.generateSignUpToken(business.email)
                  .then((token) => {
                    Mailer.notifyBusinessOfConfirmation(req.hostname, business.email, token)
                      .then(() => {
                        business._status = 'pending';
                        business.save(() => res.json({
                          message: Strings.businessConfirmation.confirmed,
                        }))
                          .catch(err => next([err]));
                      })
                      .catch(err => next([err]));
                  })
                  .catch(err => next([err]));
              }
            } else {
              res.json({
                message: Strings.businessConfirmation.notFound,
              });
            }
          })
          .catch(err => next([err]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next([err]));
});

/**
 * Admin Denies the application of the business.
 * Send an email to inform of denial.
 * `id` is the Business' ID.
 */
router.post('/deny/:id', AdminAuth, (req, res, next) => {
  req.checkParams(AdminValidator.adminConfirmBusinessValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        const search = {
          _id: req.params.id,
          _deleted: false,
        };
        Business.findOne(search)
          .exec()
          .then((business) => {
            if (business) {
              if (business._status === 'rejected') {
                next([Strings.businessConfirmation.alreadyDenied]);
              } else if (business._status === 'verified') {
                next([Strings.businessConfirmation.alreadyConfirmed]);
              } else if (business._status === 'pending') {
                next([Strings.businessConfirmation.pending]);
              } else {
                Mailer.notifyBusinessOfDenial(business.email)
                  .then(() => {
                    business._status = 'rejected';
                    business.save()
                      .then(() => {
                        res.json({
                          message: Strings.businessConfirmation.denied,
                        });
                      })
                      .catch(err => next(err));
                  })
                  .catch(err => next(err));
              }
            } else {
              res.json({
                message: Strings.businessConfirmation.notFound,
              });
            }
          })
          .catch(finderr => next([finderr]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next(err));
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
