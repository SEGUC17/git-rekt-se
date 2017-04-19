const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Booking = require('../../../../models/service/Booking');
const Business = require('../../../../models/business/Business');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');
const errorHandler = require('../../../../services/shared/errorHandler');


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
  Booking.find({ _deleted: false })
    .populate('_service', 'name')
    .populate('_client', 'fullName')
    .populate('_transaction', 'stripe_charge amount')
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
