const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const validationSchemas = require('../../../../services/shared/validation');
const Business = require('../../../../models/business/Business');
const jwt = require('jsonwebtoken');
const BusinessAuthenticator = require('../../../../services/business/BusinessAuthenticator');


const router = express.Router();
mongoose.Promise = Promise;

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
 * Business reset password
 */

router.post('/reset', (req, res, next) => {
  const resetToken = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;


  req.checkBody(validationSchemas.clientResetPasswordValidation);
  req.checkBody('confirmPassword')
    .equals(req.body.password)
.withMessage(Strings.clientValidationErrors.passwordMismatch);

  jwt.verify(resetToken, JWT_KEY, (err, payload) => {
    const email = payload.email;
    const creationDate = new Date(parseInt(payload.iat, 10) * 1000);

    Business.findOne({
      email,
      passwordChangeDate: {
        $lte: creationDate,
      },
    })
      .exec()
      .then((business) => {
        if (!business) {
          return next(Strings.businessForgotPassword.INVALID_RESET_TOKEN);
        }
        business.passwordResetTokenDate = undefined; // Disable the token
        business.passwordChangeDate = Date.now(); // Invalidate Login Tokens
        business.password = password; // Reset password

        return business.save()
          .then(() => res.json({
            message: 'password changed successfuly',
          }));
      })
      .catch(e => next([e]));
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

