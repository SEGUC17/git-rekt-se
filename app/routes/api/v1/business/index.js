const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');

const Service = require('../../../../models/service/Service');
const Category = require('../../../../models/service/Category');
const Offering = require('../../../../models/service/Offering');

const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const validator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');

mongoose.Promise = Promise;

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Express Validator Middleware
 */

router.use(expressValidator({}));

/**
 * Category CRUD routes
 */

/**
 * Business create a service
 */

// adding image not now

router.post('/create', businessAuthMiddleware, (req, res, next) => {
  /**
   * Form validation
   */
  req.checkBody(validator.serviceCreateValidation);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        /**
         * Validation passed
         */
        const reqData = {
          name: req.body.name,
          shortDescription: req.body.shortDescription,
          description: req.body.description ? req.body.description : '',
          categories: req.body.categories ? req.body.categories : [],
        };

        /**
         * Checking category IDs are invalid or not
         */
        let valid = true;
        reqData.categories.foreach((category) => {
          Category.findOne({
            _id: category,
            _deleted: false,
            type: 'Service',
          })
            .then((data) => {
              if (!data) {
                valid = false;
              }
            })
            .catch(e => next([e]));
        });

        if (valid) {
           /**
         * Saving the serivce to the service collection
         */
          const service = new Service({
            name: reqData.name,
            shortDescription: reqData.shortDescription,
            description: reqData.description,
            categories: reqData.categories,
            _business: req.user._id,
          });

          service.save()
          .then(doc => res.json({
            message: Strings.serviceSuccess.serviceAdded,
          }))
          .catch(e => next([e]));
        }
        next([Strings.serviceValidationErrors.invalidCategory]);
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 * Business create offering
 */

router.post('/:id/offering/create', businessAuthMiddleware, (req, res, next) => {
  /**
   * Form validation
   */
  req.checkBody(validator.offeringCreateValidationBody);
  req.checkParams(validator.offeringCreateValidationParams);

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      /**
       * Validation passed
       */
      const reqData = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
        branch: req.body.branch,
        price: req.body.price,
        address: req.body.address ? req.body.address : '',
      };

      Service.findOne({
        _id: req.params.id,
        _deleted: false,
      }).then((service) => {
        if (!service) {
          /**
           * No service with the id in the request params
           */
          return next([Strings.offeringValidationError.invalidService]);
        }

        if (service._business.equals(req.user._id)) {
          const business = req.user;
          if (business.branches.includes(reqData.branch)) {
            const offering = new Offering({
              startDate: reqData.startDate,
              endDate: reqData.endDate,
              location: reqData.location,
              branch: reqData.branch,
              price: reqData.price,
              address: reqData.address,
            });
            offering.save().then((offer) => {
              service.offerings.push(offer._id);
              service.branches.push(offer.branch);
              service.save().then(addedService => res.json({
                message: Strings.offerSuccess.offerAdded,
              })).catch(e => next([e]));
            }).catch(e => next([e]));
          } else {
            return next([Strings.offeringValidationError.invalidBranch]);
          }
        }

        /**
         * business doesn't own this particular service to edit it
         */
        return next([Strings.offeringValidationError.invalidOperation]);
      }).catch(e => next([e]));
    } else {
      next(result.array());
    }
  }).catch(e => next([e]));
});

/**
 * Error handling Middlewares
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});


module.exports = router;
