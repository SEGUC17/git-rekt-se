const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Offering = require('../../../../models/service/Offering');
const Booking = require('../../../../models/service/Booking');
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
router.use(bodyParser.json());
router.use(expressValidator({
  customValidators: {
    isPassword: validationSchemas.validatePassword,
  },
}));

/**
 * Get Client
 */
router.get('/:id', authMiddleWare.clientAuthMiddleware, (req, res, next) => {
  const searchID = {
    _id: req.params.id,
    _deleted: false,
  };
  Client.findOne(searchID, ['-password'])
      .exec()
      .then((client) => {
        if (!client) {
          next(Strings.clientFaliure.notFound);
        } else {
          res.json(client);
        }
      })
      .catch(next);
});

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


    req.checkBody(validationSchemas.clientUpdateValidation);
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
                  client.password = userInfo.password || client.password;
                  client.email = userInfo.email;

                  if (emailChanged) {
                    client.status = 'unconfirmed';
                    client.save()
                        .then((clientUnconfirmed) => {
                          ClientAuthenticator.generateConfirmationToken(req.body.email)
                              .then((token) => {
                                Mailer.clientConfirmEmail(
                                    req.body.email, req.hostname, token)
                                    .then(() => {
                                      res.json({
                                        message: Strings.clientSuccess
                                            .editInformationWithEmail,
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

router.get('/bookings/history', authMiddleWare.clientAuthMiddleware, (req, res, next) => {
  const projection = {
    _deleted: false,
    coupon: false,
  };
  Booking.find({
    _deleted: false,
    _client: req.user.id,
  }, projection)
    .populate('_service', 'name offerings')
    .populate('_client', 'firstName lastName')
    .populate('_transaction', 'amount')
    .exec()
    .then((bookings) => {
      bookings = bookings.map((booking) => {
        booking._service.offerings = booking._service.offerings
          .filter(offering => offering._id === booking._offering);
        return booking;
      });
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
