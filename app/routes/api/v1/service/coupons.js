const express = require('express');
const bodyParser = require('body-parser');
const Service = require('../../../../models/service/Service');
const Coupon = require('../../../../models/service/Coupon');
const validationSchemas = require('../../../../services/shared/validation');
const BusinessAuth = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const Strings = require('../../../../services/shared/Strings');
const expressValidator = require('express-validator');
const errorHandler = require('../../../../services/shared/errorHandler');

const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Add Coupon to a service.
 */

router.post('/:id/coupons/add', BusinessAuth, (req, res, next) => {
  req.check(validationSchemas.couponAddValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Service.findOne({
          _id: req.params.id,
          _deleted: false,
        })
          .exec()
          .then((service) => {
            if (service) {
              // check whether logged in business matches the service provider
              if (`${service._business}` === `${req.user._id}`) {
                // check that the given expiration date is in the future
                if (new Date(req.body.endDate)
                  .getTime() < Date.now()) {
                  next(Strings.couponValidationError.invalidEndDate);
                } else {
                  const coupon = ({
                    _service: req.params.id,
                    startDate: new Date(req.body.startDate),
                    endDate: new Date(req.body.endDate),
                    code: req.body.code,
                    discount: req.body.discount,
                  });
                  new Coupon(coupon)
                    .save()
                    .then(() => {
                      res.json({
                        message: Strings.serviceSuccess.couponAdd,
                      });
                    })
                    .catch(saveErr => next(saveErr));
                }
              } else {
                next(Strings.serviceFailure.notYourService);
              }
            } else {
              next(Strings.serviceFailure.invalidService);
            }
          })
          .catch(err => next([err]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next([err]));
});


/**
 * Delete Coupon from a service.
 */

router.post('/:ser_id/coupons/delete/:coup_id', BusinessAuth, (req, res, next) => {
  req.check(validationSchemas.couponDeleteValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Service.findOne({
          _id: req.params.ser_id,
          _deleted: false,
        })
          .exec()
          .then((service) => {
            if (service) {
              if (`${service._business}` === `${req.user._id}`) {
                // check whether logged in business matches the service provider
                Coupon.findOne({
                  _id: req.params.coup_id,
                  _deleted: false,
                })
                  .exec()
                  .then((coupon) => {
                    if (!coupon) {
                      next([Strings.couponValidationError.invalidCoupon]);
                    } else {
                      coupon._deleted = true;
                      coupon.save()
                        .then(() => {
                          res.json({
                            message: Strings.serviceSuccess.couponDelete,
                          });
                        })
                        .catch(saveErr => next(saveErr));
                    }
                  })
                  .catch(err => next(err));
              } else {
                next(Strings.serviceFailure.notYourService);
              }
            } else {
              next(Strings.serviceFailure.invalidService);
            }
          })
          .catch(err => next(err));
      } else {
        next(result.array());
      }
    })
    .catch(err => next(err));
});

/**
 * Error handling middleware.
 */

router.use(errorHandler);

module.exports = router;
