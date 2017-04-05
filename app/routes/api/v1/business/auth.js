const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const validationSchemas = require('../../../../services/shared/validation');
const Business = require('../../../../models/business/Business');
const BusinessAuthenticator = require('../../../../services/business/BusinessAuthenticator');
const errorHandler = require('../../../../services/shared/errorHandler');
const InvalidToken = require('../../../../models/shared/InvalidToken');
const jwtConfig = require('../../../../services/shared/jwtConfig');

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
          .catch(err => next(err));
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
            .catch(err => next(err));
        });
    })
    .catch(err => next(err));
});

/**
 * Business Logout.
 * http://stackoverflow.com/questions/3521290/logout-get-or-post
 */

router.post('/logout', jwtConfig.businessAuthMiddleware, (req, res, next) => {
  const token = jwtConfig.parseAuthHeader(req.headers.authorization)
    .value;
  new InvalidToken({
    token,
  })
    .save((err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: Strings.businessSuccess.logout,
      });
    });
});


/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
