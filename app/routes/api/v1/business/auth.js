const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const Business = require('../../../../models/business/Business');
const businessValidator = require('../../../../services/shared/validation')
  .verifiedBusinessValidator;

const BusinessUtils = require('../../../../services/business/businessUtils');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const validationSchemas = require('../../../../services/shared/validation');
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
 * Business reset password
 */

router.post('/reset', (req, res, next) => {
  const resetToken = req.body.token;
  const password = req.body.password;

  req.checkBody(validationSchemas.businessResetPasswordValidation);
  req.checkBody('confirmPassword')
    .equals(req.body.password)
    .withMessage(Strings.bussinessValidationErrors.passwordMismatch);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        jwt.verify(resetToken, JWT_KEY, (err, payload) => {
          if (!payload) {
            next(Strings.businessForgotPassword.INVALID_RESET_TOKEN);
          } else {
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
                    message: Strings.clientForgotPassword.PASSWORD_RESET_SUCCESS,
                  }));
              })
              .catch(e => next([e]));
          }
        });
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
 * Verified Business Signup
 */
router.post('/confirm/signup/:token', (req, res, next) => {
  /**
   * Form Validation
   */

  req.checkBody(businessValidator);
  req.checkBody('confirmPassword')
    .notEmpty()
    .equals(req.body.password)
    .withMessage(Strings.bussinessValidationErrors.passwordMismatch);

  const body = req.body;
  const token = req.params.token;

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        BusinessAuthenticator.verifyBusiness(token)
          .then((payload) => {
            console.log(payload);
            res.json({
              message: 'Done',
            });
            Business.findOne({
                email: payload.email,
                _deleted: false,
              })
              .exec()
              .then((business) => {
                if (business._status === 'pending') {
                  // BusinessUtils.addBranches(body.branches, business._id)
                  //   .then((branches) => {
                  //     business.password = body.password;
                  //     business.description = body.description;
                  //     business.workingHours = body.workingHours;
                  //     business.categories = business.categories.concat(body.categories);
                  //     business.branches = business.branches.concat(branches);
                  //     business._status = 'verified';
                  //     business.save()
                  //       .then(() => res.json({
                  //         message: 'Verification Completed Successfully',
                  //       }))
                  //       .catch(err => next([err]));
                  //   })
                  //   .catch(err => next([err]));
                } else if (business._status === 'verified') {
                  next([Strings.businessMessages.alreadyVerified]);
                } else if (business._status === 'unverified') {
                  next([Strings.businessMessages.alreadyUnverified]);
                } else {
                  next([Strings.businessMessages.alreadyRejected]);
                }
              })
              .catch(err => next([err]));
          })
          .catch(err => next(err));
      } else {
        next(result.array());
      }
    })
    .catch(err => next([err]));
});

/**
 *  Error Handling Middlewares.
 */
router.use(errorHandler);


module.exports = router;
