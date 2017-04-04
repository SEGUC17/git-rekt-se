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

router.put('/edit/:id', businessAuthMiddleware, (req, res, next) => {
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
        if (!result.isEmpty()) {
          next(result.array());
        } else {
          Business.findOne(searchID)
            .exec()
            .then((business) => {
              if (!business) {
                next([businessMessages.doesntExist]);
              } else {
                business.workingHours = body.workingHours;
                business.description = body.description;
                business.categories = body.categories
                  .filter((category, index, self) => self.indexOf(category) === index)
                  .map(category =>
                    new Schema.Types.ObjectId(category)
                    .path);
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
