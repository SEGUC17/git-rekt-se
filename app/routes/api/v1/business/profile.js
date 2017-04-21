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
router.use(expressValidator({}));

/**
 * Business edit basic information route.
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
    let emailChanged = false;


    req.checkBody(validationSchemas.businessUpdateValidation);
    req.checkBody('confirmPassword')
      .equals(req.body.password)
      .withMessage(Strings.bussinessValidationErrors.passwordMismatch);

    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
          Business.findOne({
            _id: req.params.id,
            _deleted: false,
          })
            .exec()
            .then((business) => {
              if (!business) {
                next(Strings.businessMessages.mismatchID);
                return;
              }
              if (business.email === userInfo.email) {
                emailChanged = false;
              } else {
                emailChanged = true;
              }

              /**
               * Editing existing information
               */
              const oldMail = business.email;
              business.name = userInfo.name;
              business.shortDescription = userInfo.shortDescription;
              business.phoneNumbers = userInfo.phoneNumbers;
              business.password = userInfo.password;
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
                business.save().then(() => {
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
router.get('/history', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  Booking.find({ _deleted: false }, { offering: false, _deleted: false })
    .populate('_service', 'name _business offerings')
    .populate('_client', 'firstName lastName email')
    .populate('_transaction', 'stripe_charge amount')
    .exec()
    .then((bookings) => {
      bookings = bookings.filter(booking => `${booking._service._business}` === req.user.id);
      bookings = bookings.map((booking) => {
        booking._service.offerings = booking._service.offerings
          .filter(offering => offering._id === booking._offering);
        return booking;
      });
      console.log(bookings);
      res.json({
        bookings,
      });
    })
    .catch(next);
});

/**
 * Business Accept Transaction API Route.
 */
router.post('/accept', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  const bookingId = req.body.bookingId;
  const clientEmail = req.body.email;
  Booking.findOne({
    _id: bookingId,
  }).exec().then((booking) => {
    if (!booking) {
      next('Booking does not exist!');
    } else if (booking.status !== 'pending') {
      next('Transaction must be in pending state!');
    } else {
      booking.status = 'confirmed';
      booking.save().then(() => {
        mailer.notifyClientOnTransactionAccept(clientEmail)
          .then(() => {
            res.json({ message: 'Successfully Accepted Transaction.' });
          }).catch(next);
      }).catch(next);
    }
  }).catch(next);
});

/**
 * Business Refund Transaction API Route.
 */
router.post('/reject', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  const bookingId = req.body.bookingId;
  const stripeId = req.body.stripeId;
  const clientEmail = req.body.email;
  Booking.findOne({
    _id: bookingId,
  }).exec().then((booking) => {
    if (!booking) {
      next('Booking does not exist!');
    } else if (booking.status !== 'pending') {
      next('Transaction must be in pending state!');
    } else {
      stripe.refund(stripeId, {}, (err) => {
        if (err) {
          next(err);
        } else {
          booking.status = 'rejected';
          booking.save().then(() => {
            mailer.notifyClientOnTransactionRefund(clientEmail)
              .then(() => {
                res.json({ message: 'Successfully Refunded Transaction.' });
              }).catch(next);
          }).catch(next);
        }
      });
    }
  }).catch(next);
});

// TODO REMOVE THIS ROUTE
router.get('/btngan', (req, res) => {
  new Branch({
    _business: '58ed2ff231b4244b489982a2',
    location: 'Nasr City',
    address: 'Mostafa El Na7as',
  }).save().then((branch) => {
    new Offering({
      branch: branch._id,
      location: branch.location,
      address: branch.address,
      price: 20,
      startDate: Date.now(),
      endDate: new Date(2017, 6, 2),
    }).save().then((offering) => {
      for (let i = 0; i < 3; i += 1) {
        const service = new Service({
          name: `Btngan ${i}`,
          shortDescription: `More Btngan ${i}`,
          _business: '58ed2ff231b4244b489982a2',
          branches: [branch._id],
        });
        service.offerings.push(offering);
        service
          .save()
          .then(() => {
            console.log('Done');
            res.json({
              message: 'Done',
            });
          })
          .catch(err => console.log(err.errors));
      }
    }).catch(err => console.log(err.message));
  }).catch(err => console.log(err.message));
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
