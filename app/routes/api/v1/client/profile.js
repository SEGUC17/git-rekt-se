const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Bookings = require('../../../../models/service/Booking');
const Client = require('../../../../models/client/Client');
const ClientAuthenticator = require('../../../../services/client/ClientAuthenticator');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');
const errorHandler = require('../../../../services/shared/errorHandler');


const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Client edit information route.
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
                            next(e);
                          });
                      })
                      .catch((e) => {
                        next(e);
                      });
                  })
                  .catch(e => next(e));
              } else {
                client.save()
                .then(() => {
                  res.json({
                    message: Strings.clientSuccess.editInformation,
                  });
                });
              }
            })
            .catch((e) => {
              next(e);
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
 * Client View Transactions API Route.
 */
router.get('/history', authMiddleWare.clientAuthMiddleware, (req, res, next) => {
  Bookings.find({
    _deleted: false,
    _client: req.user.id,
  })
    .populate('_service', 'name')
    .populate('_transaction', 'amount')
    .populate('_client', 'firstName lastName')
    .populate('_offering')
    .exec()
    .then((bookings) => {
      console.log(bookings);
      res.json({
        bookings,
      });
    })
    .catch(next);
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
