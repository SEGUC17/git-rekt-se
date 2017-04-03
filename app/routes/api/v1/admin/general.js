const express = require('express');
const Business = require('../../../../models/business/Business');
const AdminAuth = require('../../../../services/shared/jwtConfig').adminAuthMiddleware;
const Strings = require('../../../../services/shared/Strings');

const router = express.Router();

router.post('/confirm/:id', AdminAuth, (req, res, next) => {
  Business.findOne({
    _id: req.params.ser_id,
    _deleted: false,
  })
    .exec((err, business) => {
      if (err) {
        next(err);
      }
      if (business) {
        if (business.confirmed === true) {
          res.json({
            message: Strings.businessConfirmation.alreadyConfirmed,
          });
          next(err);
        } else {
          business.confirmed = true;
          business.save((saveErr) => {
            if (saveErr) {
              next(saveErr);
            } else {
              res.json({
                message: Strings.businessConfirmation.confirmed,
              });
            }
          });
        }
      } else {
        res.json({
          message: Strings.businessConfirmation.notFound,
        });
        next(err);
      }
    });
});

router.post('/deny/:id', AdminAuth, (req, res, next) => {
  Business.findOne({
    _id: req.params.ser_id,
    _deleted: false,
  })
    .exec((err, business) => {
      if (err) {
        next(err);
      }
      if (business) {
        if (business.confirmed === true) {
          res.json({
            message: Strings.businessConfirmation.alreadyConfirmed,
          });
          next(err);
        } else {
          business._deleted = true;
          business.save((saveErr) => {
            if (saveErr) {
              next(saveErr);
            } else {
              res.json({
                message: Strings.businessConfirmation.denied,
              });
            }
          });
        }
      } else {
        res.json({
          message: Strings.businessConfirmation.notFound,
        });
        next(err);
      }
    });
});
