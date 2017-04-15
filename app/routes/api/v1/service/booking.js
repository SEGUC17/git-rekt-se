const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const errorHandler = require('../../../../services/shared/errorHandler');
const validationSchemas = require('../../../../services/shared/validation');
const jwtConfig = require('../../../../services/shared/jwtConfig');
const Strings = require('../../../../services/shared/Strings');
const Service = require('../../../../models/service/Service');
const Coupon = require('../../../../models/service/Coupon');
const Booking = require('../../../../models/service/Booking');
const Client = require('../../../../models/client/Client');
const Transaction = require('../../../../models/service/Transaction');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Book a service API.
 */

router.post('/', jwtConfig.clientAuthMiddleware, (req, res, next) => {
  const transactionInfo = {
    service: req.body.service,
    offering: req.body.offering,
    coupon: req.body.coupon,
    token: req.body.token,
  };

  req.checkBody(validationSchemas.valid);
  req.getValidationResult()
    .then((results) => {
      if (results.isEmpty()) {
        Service.findOne({
          _id: transactionInfo.service,
          _deleted: false,
        })
          .then((result) => {
            if (!result || result.offerings.length === 0) {
              next(Strings.serviceFailure.invalidService);
              return;
            }

            let resultOffering;

            result.offerings.forEach((offering) => {
              if (`${offering._id}` === transactionInfo.offering) {
                resultOffering = offering;
              }
            });

            if (!resultOffering) {
              next(Strings.serviceFailure.invalidService);
              return;
            }

            Coupon.findOne({
              _id: transactionInfo.coupon,
              _deleted: false,
            })
              .exec()
              .then((coupon) => {
                let price = resultOffering.price * 100;

                if (coupon) {
                  const startDate = coupon.startDate.getTime();
                  const endDate = coupon.endDate.getTime();
                  const currentDate = Date.now();
                  if (currentDate >= startDate && currentDate <= endDate) {
                    price *= ((100 - coupon.discount) / 100.0);
                  }
                }

                stripe.charges.create({
                  amount: price,
                  currency: 'egp',
                  source: transactionInfo.token,
                  description: 'Charge for Git-rekt',
                }, (err, trans) => {
                  if (err) {
                    next(err);
                    return;
                  }

                  new Transaction({
                    _client: req.user._id,
                    _business: result._business,
                    stripe_charge: trans.id,
                    amount: price,
                  })
                    .save()
                    .then((transaction) => {
                      new Booking({
                        _service: result._id,
                        _client: req.user._id,
                        _offering: resultOffering._id,
                        _coupon: coupon,
                        _transaction: transaction._id,
                      })
                        .save()
                        .then((booking) => {
                          res.json(booking);
                        })
                        .catch(next);
                    })
                    .catch(next);

                  res.json(trans);
                });
              })
              .catch(e => next(e));
          });
      } else {
        next(results.array());
      }
    });
});

/**
 * Stripe charge token.
 * TESTING ROUTE
 */

router.get('/token', (req, res, next) => {
  stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2018,
      cvc: '123',
    },
  }, (err, token) => res.json(token.id));
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
