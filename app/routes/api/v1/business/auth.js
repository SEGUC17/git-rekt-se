const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Strings = require('../../../../services/shared/Strings');
const validationSchemas = require('../../../../services/shared/validation');

const router = express.Router();

/**
 * Parsing Middleware(s)
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Business signup route
 */

router.post('/unverified/signup', (req, res, next) => {
  /**
   * Body Inputs
   */

  const userInfo = {
    name: req.body.name,
    email: req.body.email,
    shortDescription: req.body.birthdate,
    mobile: req.body.mobile, // Add to phone numbers array
  };

  /**
   * Form Validation.
   */

  req.checkBody(validationSchemas.businessSignupValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        // TODO: Handle Signup
      } else {
        next(result.array());
      }
    });
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
