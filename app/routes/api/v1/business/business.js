const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const Business = require('../../../../models/business/Business');
const BusinessUtils = require('../../../../services/business/businessUtils');
const businessMessages = require('../../../../services/shared/Strings')
  .businessMessages;
const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;

mongoose.Promise = Promise;

const router = express.Router();

router.use(bodyParser.json());

router.put('/:id', businessAuthMiddleware, (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const searchID = {
    _id: id,
  };
  // TODO filter other keys ?
  const keys = Object.keys(body);
  if (keys.length === 0) {
    next([businessMessages.allFieldsEmpty]);
  } else {
    Business.findOne(searchID)
      .exec()
      .then((business) => {
        if (!business) {
          next([businessMessages.doesntExist]);
        } else {
          if (body.workingHours && body.workingHours.length > 0) {
            business.workingHours = body.workingHours;
          }
          if (body.description && body.description.length > 0) {
            business.description = body.description;
          }
          if (body.categories && body.categories.length > 0) {
            BusinessUtils.addCategories(body.categories)
              .then((allCategories) => {
                business.categories = business.categories.concat(allCategories);
                business.save()
                  .then(() => res.json({
                    message: businessMessages.editSuccess,
                  }))
                  .catch(err => next([err]));
              })
              .catch(err => next([err]));
          } else {
            business.save()
              .then(() => res.json({
                message: businessMessages.editSuccess,
              }))
              .catch(err => next([err]));
          }
        }
      })
      .catch(err => next([err]));
  }
});

/**
 * Error Handling Middleware
 */
router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;
