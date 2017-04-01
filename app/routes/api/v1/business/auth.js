const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const validationSchemas = require('../../../../services/shared/validation');
const Business = require('../../../../models/business/Business');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const router = express.Router();
mongoose.Promise = Promise;

require('dotenv')
  .config();

const JWT_KEY = process.env.JWT_KEY;


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
    shortDescription: req.body.shortDescription,
    mobile: req.body.mobile, // Add to phone numbers array
  };

  /**
   * Form Validation.
   */

  req.checkBody(validationSchemas.businessSignupValidation);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        new Business({
          name: userInfo.name,
          email: userInfo.email,
          shortDescription: userInfo.shortDescription,
          phoneNumbers: [userInfo.mobile],
        })
          .save()
          .then(() => {
            Mailer.notifyAdminOfNewBusinessSignup()
              .then(() => {
                res.json({
                  message: Strings.businessSuccess.unverifiedSignup,
                });
              })
              .catch(() => next([Strings.generalErrors.mailerError]));
          })
          .catch(() => next([Strings.bussinessValidationErrors.businessExists]));
      } else {
        next(result.array());
      }
    });
});

/**
 * Business forgot password
 */

router.post('/forgot', (req, res, next) => {
  const email = req.body.email;
  const iat = Math.floor(Date.now() / 1000);
  const resetToken = jwt.sign({
    email,
    iat,
  }, JWT_KEY, {
    expiresIn: '1h',
  });

  Business.findOne({
    email: req.body.email,
  }).exec().then((business) => {
    if (!business) { // Business not found, Invalid mail
      // Not using middleware due to status

      res.json({
        message: Strings.CHECK_YOU_EMAIL,
      });
    }

    business.passwordResetTokenDate = iat * 1000;

    business.save().then(() => {
      Mailer.forgotPasswordEmail(email, req.headers.host, resetToken)
        .then(() => res.json('working'))
        .catch(() => res.json('err'));
    });
  }).catch(err => next([err]));
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

