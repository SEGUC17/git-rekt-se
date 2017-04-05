const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Client = require('../../../../models/client/Client');
const ClientAuthenticator = require('../../../../services/client/ClientAuthenticator');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');


const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Client edit information route
 */

router.post('/:id/edit', authMiddleWare.clientAuthMiddleware, (req, res, next) => {
  if (req.user.id === req.params.id) {
  /**
   * The new data
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
    let emailChanged = false;


    req.checkBody(validationSchemas.clientSignupValidation);
    req.checkBody('confirmPassword')
      .equals(req.body.password)
      .withMessage(Strings.clientValidationErrors.passwordMismatch);

    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
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
              client.save()
                .then((newClient) => {
                  /**
                   * Editing existing information
                   */

                  client.firstName = userInfo.firstName;
                  client.lastName = userInfo.lastName;
                  client.mobile = userInfo.mobile;
                  client.gender = userInfo.gender;
                  client.birthdate = userInfo.birthdate;
                  client.password = userInfo.password;
                  client.email = userInfo.email;

                  if (emailChanged) {
                    client.status = 'unconfirmed';
                    client.save()
                      .then((clientUnconfirmed) => {
                        ClientAuthenticator.generateConfirmationToken(req.body.email)
                          .then((token) => {
                            Mailer.clientConfirmEmail(req.body.email, req.hostname, token)
                              .then(() => {
                                res.json({
                                  message: Strings.clientSuccess.editInformationWithEmail,
                                });
                              })
                              .catch((e) => {
                                next([e]);
                              });
                          })
                          .catch((e) => {
                            next([e]);
                          });
                      })
                      .catch(e => next(e));
                  } else {
                    res.json({
                      message: Strings.clientSuccess.editInformation,
                    });
                  }
                })
                .catch(e => next(e));
            })
            .catch((e) => {
              next([e]);
            });
        } else {
          next(result.array());
        }
      });
  } else {
    next(Strings.clientLoginMessages.notLoggedIn);
  }
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
