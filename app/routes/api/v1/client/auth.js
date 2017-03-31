const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Client = require('../../../../models/client/Client');
const ClientAuthenticator = require('../../../../services/client/ClientAuthenticator');

const router = express.Router();

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
    .withMessage('Password and Password Confirmation must match.');

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
                      message: 'Signup Successful, Please check your email for the email confirmation.',
                    });
                  })
                  .catch(e => next([e]));
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
 *  Error Handling Middlewares.
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;
