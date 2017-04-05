const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const Business = require('../../../../models/business/Business');
const businessValidator = require('../../../../services/shared/validation')
  .verifiedBusinessValidator;
const validatorErrors = require('../../../../services/shared/Strings')
  .bussinessValidationErrors;

const BusinessUtils = require('../../../../services/business/VerifiedBusinessUtil.js');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const validationSchemas = require('../../../../services/shared/validation');
const BusinessAuthenticator = require('../../../../services/business/BusinessAuthenticator');

mongoose.Promise = Promise;

const router = express.Router();

require('dotenv')
  .config();

const JWT_KEY = process.env.JWT_KEY_BUSSINES;

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Business signup route.
 */

router.post('/unverified/signup', (req, res, next) => {
  /**
   * Body Inputs.
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
 * Business login route.
 */

router.post('/verified/login', (req, res, next) => {
  req.checkBody(validationSchemas.businessLoginValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        BusinessAuthenticator.loginBusiness(req.body.email, req.body.password)
          .then(info => res.json(info))
          .catch(err => next([err]));
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
  const currentDate = Date.now();
  const iat = Math.floor(currentDate / 1000);
  const resetToken = jwt.sign({
    email,
    iat,
  }, JWT_KEY, {
    expiresIn: '1h',
  });

  Business.findOne({
    email: req.body.email,
  })
    .exec()
    .then((business) => {
      if (!business) { // Business not found, Invalid mail
        return res.json({
          message: Strings.businessForgotPassword.CHECK_YOU_EMAIL,
        });
      }
      business.passwordResetTokenDate = currentDate;

      return business.save()
        .then(() => {
          Mailer.forgotPasswordEmail(email, req.headers.host, resetToken)
            .then(() => res.json({
              message: Strings.businessForgotPassword.CHECK_YOU_EMAIL,
            }))
            .catch(err => next([err]));
        });
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

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        // TODO Change Parameter
        Business.findOne(dbQuery)
          .exec()
          .then((business) => {
            BusinessUtils.addCategories(body.categories)
              .then((categories) => { /* eslint-disable no-param-reassign, no-underscore-dangle */
                BusinessUtils.addBranches(body.branches, business)
                  .then((branches) => {
                    business.password = body.password;
                    business.description = body.description;
                    business.workingHours = body.workingHours;
                    business.categories.concat(categories);
                    business.branches.concat(branches);
                    business._status = 'verified';

                    /* eslint-enable no-param-reassign, no-underscore-dangle */

                    business.save()
                      .then(() => res.json({
                        message: 'Verification Completed Successfully',
                      }))
                      .catch(err => next([err]));
                  })
                  .catch(err => next([err]));
              })
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
