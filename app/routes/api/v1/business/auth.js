const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const Category = require('../../../../models/service/Category');
const Branch = require('../../../../models/service/Branch');
const Business = require('../../../../models/business/Business');
const businessValidator = require('../../../../services/shared/validation')
  .verifiedBusinessValidator;
const validatorErrors = require('../../../../services/shared/Strings')
  .bussinessValidationErrors;

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator());

/**
 * Business signup route
 */

router.post('/signup', (req, res) => {
  res.send({
    message: 'This should be fun.',
  });
});

/**
 * Verified Business Signup
 */
// TODO will most probably change route
router.post('/confirm/:token', (req, res, next) => {
  /**
   * Form Validation
   */

  req.checkBody(businessValidator);
  req.checkBody('confirmPassword')
    .notEmpty()
    .equals(req.body.password)
    .withMessage(validatorErrors.passwordMismatch);

  const body = req.body;
  // TODO Change to token and verify
  const dbQuery = {
    name: body.name,
  };

  const categoryIds = [];
  const branchIds = [];

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        // TODO Change Parameter
        Business.findOne(dbQuery)
          .exec()
          .then((business) => {
            /* eslint-disable no-param-reassign, no-underscore-dangle */
            business.password = body.password;
            business.description = body.description;
            business.workingHours = body.workingHours;
            business.categories.concat(categoryIds);
            business.branches.concat(branchIds);
            business._status = 'verified';
            /* eslint-enable no-param-reassign, no-underscore-dangle */
            business.save()
              .then(() => res.json({
                message: 'Verification Completed Successfully',
              }))
              .catch(err => next([err]));
          })
          .catch(err => next([err]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next([err]));
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
