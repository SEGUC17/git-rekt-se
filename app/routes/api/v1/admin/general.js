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

const router = express.Router();
mongoose.Promise = Promise;

router.use(bodyParser.json());
router.use(expressValidator({}));

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
          .catch(finderr => next([finderr]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next([err]));
});

/**
 *  Error Handling Middlewares.
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;
