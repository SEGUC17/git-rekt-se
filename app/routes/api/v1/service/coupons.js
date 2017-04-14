const express = require('express');
const bodyParser = require('body-parser');
const Service = require('../../../../models/service/Service');
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
  console.log('authenticated');
  console.log(req.body);
  req.check(validationSchemas.couponAddValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        console.log('validated');
        Service.findOne({
          _id: req.params.id,
          _deleted: false,
        })
          .exec()
          .then((service) => {
            console.log('found service');
            if (service) {
              // check whether logged in business matches the service provider
              if (`${service._business}` === `${req.user._id}`) {
                // check that the given date is in the future
                console.log('myservice');
                console.log(req.body.expiration);

                const coupon = ({
                  code: req.body.code,
                  value: req.body.value,
                  expiration: new Date(req.body.expiration),
                });
                console.log('gonna push');
                service.coupons.push(coupon);
                console.log('push done');
                service.save()
                  .then(() => {
                    res.json({
                      message: Strings.serviceSuccess.couponAdd,
                    });
                  })
                  .catch((saveErr) => {
                    console.log(saveErr);
                    next(saveErr)
;
                  });
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
 * Delete Coupon in a service.
 */

router.post('/:ser_id/coupons/delete/:coup_id', BusinessAuth, (req, res, next) => {
  req.check(validationSchemas.couponDeleteValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Service.findOne({
          _id: req.params.ser_id,
        })
          .exec()
          .then((service) => {
            if (service) {
              if (`${service._business}` === `${req.user._id}`) {
                const coupon = service.coupons
                  .find(element => `${element._id}` === `${req.params.coup_id}`);
                if (!coupon) {
                  next([Strings.couponValidationError.invalidCoupon]);
                } else {
                  const newCoupons = service.coupons
                    .filter(element => `${element._id}` !== `${req.params.coup_id}`);
                  service.coupons = newCoupons;
                  service.save()
                    .then(() => {
                      res.json({
                        message: Strings.serviceSuccess.couponDelete,
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
