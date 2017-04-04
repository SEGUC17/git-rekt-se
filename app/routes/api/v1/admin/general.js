const express = require('express');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business');
const AdminAuth = require('../../../../services/shared/jwtConfig').adminAuthMiddleware;
const AdminValidator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');

const router = express.Router();
mongoose.Promise = Promise;

router.post('/confirm/:id', AdminAuth, (req, res, next) => {
  req.checkParams(AdminValidator.adminConfirmBusinessValidation);
  Business.findOne({
    _id: req.params.ser_id,
    _deleted: false,
  })
  .exec()
  .then((business) => {
    console.log('1111111111111111111111111111111111111111');
    if (business) {
      console.log('22222222222222222222222222222222222222222');
      if (business._status === 'verified') {
        res.json({
          message: Strings.businessConfirmation.alreadyConfirmed,
        });
      } else if (business._status === 'rejected') {
        res.json({
          message: Strings.businessConfirmation.alreadyDenied,
        });
      } else {
        console.log('33333333333333333333333333333333333333333333');
        business._status = 'verified';
        business.save()
        .exec()
        .then(() => {
          Mailer.notifyBusinessOfConfirmation(business.email)
          .then(res.json({
            message: Strings.businessConfirmation.confirmed,
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
  }).catch(err => next([err]));
});

router.post('/deny/:id', AdminAuth, (req, res, next) => {
  req.checkParams(AdminValidator.adminConfirmBusinessValidation);
  Business.findOne({
    _id: req.params.ser_id,
    _deleted: false,
  })
    .exec()
    .then((business) => {
      if (business) {
        if (business._status === 'rejected') {
          res.json({
            message: Strings.businessConfirmation.alreadyDenied,
          });
        } else if (business._status === 'confirmed') {
          res.json({
            message: Strings.businessConfirmation.alreadyConfirmed,
          });
        } else {
          business._status = 'rejected';
          business.save()
          .exec()
          .then(() => {
             // send e-mail
            Mailer.notifyBusinessOfDenial(business.emails)
          .then(res.json({
            message: Strings.businessConfirmation.confirmed,
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
    }).catch(err => next([err]));
});

module.exports = router;
