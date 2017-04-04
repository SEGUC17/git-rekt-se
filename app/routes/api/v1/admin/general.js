const express = require('express');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business');
const AdminAuth = require('../../../../services/shared/jwtConfig').adminAuthMiddleware;
const Strings = require('../../../../services/shared/Strings');

const router = express.Router();
mongoose.Promise = Promise;

router.post('/confirm/:id', AdminAuth, (req, res, next) => {
  Business.findOne({
    _id: req.params.ser_id,
    _deleted: false,
  })
  .exec()
  .then((business) => {
    if (business) {
      if (business._status === 'verified') {
        res.json({
          message: Strings.businessConfirmation.alreadyConfirmed,
        });
      } else if (business._status === 'rejected') {
        res.json({
          message: Strings.businessConfirmation.alreadyDenied,
        });
      } else {
        business._status = 'verified';
        business.save()
        .exec()
        .then(() => {
          // send e-mail
          res.json({
            message: Strings.businessConfirmation.confirmed,
          });
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
            res.json({
              message: Strings.businessConfirmation.denied,
            });
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
