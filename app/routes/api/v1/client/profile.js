const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Client = require('../../../../models/client/Client');
const ClientAuthenticator = require('../../../../services/client/ClientAuthenticator');
const Strings = require('../../../../services/shared/Strings');


const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Client edit information route
 */

router.post('/:id/edit', (req, res, next) => {
  const userInfo = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
  };
  let emailChanged = false;


  Client.findOne({
    _id: req.params.id,
  })
    .exec()
    .then((client) => {
      if (client.email === userInfo.email) {
        emailChanged = false;
      } else {
        emailChanged = true;
      }

      req.checkBody(validationSchemas.clientSignupValidation);
      req.checkBody('confirmPassword')
        .equals(req.body.password)
        .withMessage(Strings.clientValidationErrors.passwordMismatch);

      req.getValidationResult()
        .then((result) => {
          if (result.isEmpty()) {
            client.firstName = userInfo.firstName;
            client.lastName = userInfo.lastName;
            client.mobile = userInfo.mobile;
            client.gender = userInfo.gender;
            client.birthdate = userInfo.birthdate;
            client.password = userInfo.password;
            client.email = userInfo.email;
            client.status = 'unconfirmed';

            client.save((err) => {
              if (emailChanged) {
                ClientAuthenticator.generateConfirmationToken(req.body.email)
                  .then((token) => {
                    Mailer.clientConfirmEmail(req.body.email, req.hostname, token)
                      .then(() => {
                        res.json({
                          message: 'Your information has been updated successfully. Please confirm your mail',
                        });
                      })
                      .catch((e) => {
                        next([e]);
                      });
                  })
                  .catch((e) => {
                    next([e]);
                  });
              } else {
                res.json({
                  message: 'Your information has been updated successfully',
                });
              }
            });
          } else {
            next(result.array());
          }
        });
    })
    .catch((e) => {
      next([e]);
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
