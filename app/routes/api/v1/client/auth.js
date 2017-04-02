const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Client = require('../../../../models/client/Client');
const ClientAuthenticator = require('../../../../services/client/ClientAuthenticator');
const Strings = require('../../../../services/shared/Strings');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const router = express.Router();
mongoose.Promise = Promise;

require('dotenv')
  .config();

const JWT_KEY = process.env.JWT_KEY;
/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Client signup route
 */

router.post('/signup', (req, res, next) => {
  /**
   * Body Inputs
   */

  const userInfo = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
  };

  /**
   * Form Validation.
   */

  req.checkBody(validationSchemas.clientSignupValidation);
  req.checkBody('confirmPassword')
    .equals(req.body.password)
    .withMessage(Strings.clientValidationErrors.passwordMismatch);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        new Client(userInfo)
          .save()
          .then(() => {
            ClientAuthenticator.generateConfirmationToken(req.body.email)
              .then((token) => {
                Mailer.clientConfirmEmail(req.body.email, req.hostname, token)
                  .then(() => {
                    res.json({
                      message: Strings.clientSuccess.signup,
                    });
                  })
                  .catch(e => next([e]));
              })
              .catch(e => next([e]));
          })
          .catch(() => next([Strings.clientValidationErrors.userExists]));
      } else {
        next(result.array());
      }
    });
});

/**
 * Send Confirmation Mail Route
 * For resending a confirmation Mail to User
 */

router.post('/confirmation/send', (req, res, next) => {
  req.checkBody(validationSchemas.clientConfirmEmailValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        ClientAuthenticator.generateConfirmationToken(req.body.email)
          .then((token) => {
            Mailer.clientConfirmEmail(req.body.email, req.hostname, token)
              .then(() => {
                res.json({
                  message: Strings.clientSuccess.emailConfirmation,
                });
              })
              .catch(e => next([e]));
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    });
});

/**
 * Confirm Email Route
 */

router.post('/confirmation/:token/confirm', (req, res, next) => {

});


/**
 * Client Login
 */

router.post('/login', (req, res, next) => {
  req.checkBody(validationSchemas.clientLoginValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        ClientAuthenticator.loginClient(req.body.email, req.body.password)
          .then(info => res.json(info))
          .catch(err => next([err]));
      } else {
        next(result.array());
      }
    });
});

/**
 * Client forgot password
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

  Client.findOne({
    email: req.body.email,
  }).exec().then((client) => {
    if (!client) { // Client not found, Invalid mail
      return res.json({
        message: Strings.clientForgotPassword.CHECK_YOU_EMAIL,
      });
    }
    client.passwordResetTokenDate = Date.now();

    return client.save().then(() => {
      Mailer.forgotPasswordEmail(email, req.hostname, resetToken)
        .then(() => res.json({ message: Strings.clientForgotPassword.CHECK_YOU_EMAIL }))
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
