const express = require('express');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;
const AdminValidator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');


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
              if (business._status === 'verified') {
                next([Strings.businessConfirmation.alreadyConfirmed]);
              } else if (business._status === 'rejected') {
                next([Strings.businessConfirmation.alreadyDenied]);
              } else {
                business._status = 'verified';
                business.save()
                  .then(() => {
                    Mailer.notifyBusinessOfConfirmation(req.hostname, business.email)
                      .then(() => {
                        res.json({
                          message: Strings.businessConfirmation.confirmed,
                        });
                      })
                      .catch(err => next([err]));
                  })
                  .catch(saveErr => next([saveErr]));
              }
            } else {
              res.json({
                message: Strings.businessConfirmation.notFound,
              });
            }
          })
          .catch(err => next([err]));
      } else {
        next(['Invalid ID Format!']);
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
                business._status = 'rejected';
                business.save()
                  .then(() => {
                    Mailer.notifyBusinessOfDenial(business.email)
                      .then(() => res.json({
                        message: Strings.businessConfirmation.denied,
                      }))
                      .catch(err => next([err]));
                  })
                  .catch(saveErr => next([saveErr]));
              }
            } else {
              res.json({
                message: Strings.businessConfirmation.notFound,
              });
            }
          })
          .catch(finderr => next([finderr]));
      } else {
        next(['Invalid ID Format!']);
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
