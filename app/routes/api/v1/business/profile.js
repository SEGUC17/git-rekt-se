const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Offering = require('../../../../models/service/Offering');
const Branch = require('../../../../models/service/Branch');
const Service = require('../../../../models/service/Service');
const Booking = require('../../../../models/service/Booking');
const Business = require('../../../../models/business/Business');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');
const errorHandler = require('../../../../services/shared/errorHandler');
const mailer = require('../../../../services/shared/Mailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({
  customValidators: {
    isPassword: validationSchemas.validatePassword,
    arePhoneNumbers: validationSchemas.validatePhoneNumber,
  },
}));

/**
 * Get Business
 */
router.get('/profile', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  const searchID = {
    _id: req.user._id,
    _deleted: false,
    _status: 'verified',
  };
  const projection = {
    name: true,
    email: true,
    shortDescription: true,
    phoneNumbers: true,
  };
  Business.findOne(searchID, projection)
    .exec()
    .then((business) => {
      if (!business) {
        next(Strings.businessMessages.businessDoesntExist);
      } else {
        res.json({
          business,
        });
      }
    })
    .catch(next);
});

/**
 * Business Edit Basic Information API Route.
 */

router.post('/:id/edit', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  if (req.user.id === req.params.id) {
    /**
     * The new data
     */

    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      shortDescription: req.body.shortDescription,
      phoneNumbers: req.body.phoneNumbers,
    };

    const search = {
      _id: req.params.id,
      _deleted: false,
    };

    let emailChanged = false;

    req.checkBody(validationSchemas.businessUpdateValidation);
    req.checkBody('confirmPassword')
      .equals(req.body.password)
      .withMessage(Strings.bussinessValidationErrors.passwordMismatch);

    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
          Business.findOne(search)
            .exec()
            .then((business) => {
              if (!business) {
                next(Strings.businessMessages.mismatchID);
                return;
              }
              emailChanged = business.email !== userInfo.email;

              /**
               * Editing existing information
               */
              const oldMail = business.email;
              business.name = userInfo.name;
              business.shortDescription = userInfo.shortDescription;
              business.phoneNumbers = userInfo.phoneNumbers;
              business.password = userInfo.password || business.password;
              business.email = userInfo.email;

              if (emailChanged) {
                business.save()
                  .then(() => {
                    Mailer.sendConfirmationMessage(oldMail)
                      .then(() => {
                        res.json({
                          message: Strings.businessSuccess.emailConfirmation,
                        });
                      })
                      .catch((e) => {
                        next([e]);
                      });
                  })
                  .catch(e => next(e));
              } else {
                business.save()
                  .then(() => {
                    res.json({
                      message: Strings.businessInformationChanged.UPDATE_SUCCESSFULL,
                    });
                  });
              }
            })
            .catch((e) => {
              next([e]);
            });
        } else {
          next(result.array());
        }
      });
  } else {
    next(Strings.businessMessages.mismatchID);
  }
});

/**
 * View Transaction History API Route.
 */
router.get('/transactions', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  Booking.find({
    _deleted: false,
  }, {
    offering: false,
    _deleted: false,
  })
    .populate('_service', 'name _business offerings')
    .populate('_client', 'firstName lastName email')
    .populate('_transaction', 'stripe_charge amount status')
    .exec()
    .then((bookings) => {
      bookings = bookings.filter(booking => `${booking._service._business}` === req.user.id);
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
 * Business Accept Transaction API Route.
 */
router.post('/transactions/accept', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  const bookingId = req.body.bookingId;
  const clientEmail = req.body.email;

  Booking.findOne({
    _id: bookingId,
    _deleted: false,
  })
    .exec()
    .then((booking) => {
      if (!booking) {
        next('Booking does not exist!');
      } else if (booking.status !== 'pending') {
        next('Transaction must be in pending state!');
      } else {
        booking.status = 'confirmed';
        booking.save()
          .then(() => {
            mailer.notifyClientOnTransactionAccept(clientEmail)
              .then(() => {
                res.json({
                  message: 'Booking confirmed.',
                });
              })
              .catch(next);
          })
          .catch(next);
      }
    })
    .catch(next);
});

/**
 * Business Refund Transaction API Route.
 */
router.post('/transactions/reject', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  const bookingId = req.body.bookingId;
  const stripeId = req.body.stripeId;
  const clientEmail = req.body.email;
  Booking.findOne({
    _id: bookingId,
    _deleted: false,
  })
    .populate('_transaction', '_id status')
    .exec()
    .then((booking) => {
      if (!booking) {
        next('Booking does not exist!');
      } else if (booking.status !== 'pending') {
        next('Transaction must be in pending state!');
      } else {
        stripe.refunds.create({
          charge: stripeId,
        }, (err) => {
          if (err) {
            next(err);
          } else {
            booking._transaction.status = 'refunded';
            booking.status = 'rejected';
            booking
              ._transaction
              .save()
              .then(() => {
                booking.save()
                  .then(() => {
                    mailer.notifyClientOnTransactionRefund(clientEmail)
                      .then(() => {
                        res.json({
                          message: 'Booking Cancelled and transaction refunded.',
                        });
                      })
                      .catch(next);
                  })
                  .catch(next);
              })
              .catch(next);
          }
        });
      }
    })
    .catch(next);
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
