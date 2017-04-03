const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const Schema = mongoose.Schema;

const Business = require('../../../../models/business/Business');
const businessMessages = require('../../../../services/shared/Strings')
  .businessMessages;
const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const businessEditInfoValidation = require('../../../../services/shared/validation')
  .businessEditInfoValidation;

mongoose.Promise = Promise;

const router = express.Router();

router.use(bodyParser.json());
router.use(expressValidator({}));

router.put('/:id', businessAuthMiddleware, (req, res, next) => {
  const id = req.params.id;
  if (req.user.id !== id) {
    next([businessMessages.mismatchID]);
  } else {
    const body = req.body;
    const searchID = {
      _id: id,
    };
    req.checkBody(businessEditInfoValidation);
    req.getValidationResult()
      .then((result) => {
        const resultArray = result.array();
        // All Are Empty
        if (resultArray.length === 3) {
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
                  business.categories = body.categories
                    .map(category => Schema.Types.ObjectId(category));
                }
                business.save()
                  .then(() => res.json({
                    message: businessMessages.editSuccess,
                  }))
                  .catch(err => next([err]));
              }
            })
            .catch(err => next([err]));
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
