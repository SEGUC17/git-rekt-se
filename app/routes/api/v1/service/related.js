const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');
const validationSchemas = require('../../../../services/shared/validation');
const errorHandler = require('../../../../services/shared/errorHandler');
const relatedServiceUtils = require('../../../../services/business/relatedServiceUtils');

const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Related Services API Route.
 */

router.get('/related/:id', (req, res, next) => {
  req.checkParams(validationSchemas.relatedServiceValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Service.findOne({
          _id: req.params.id,
        })
          .then((resultService) => {
            relatedServiceUtils.getRelatedServices(resultService.categories, req.params.id)
              .then((services) => {
                const serviceModified = [];
                services.forEach((service) => {
                  service.forEach((serviceObj) => {
                    serviceModified.push(serviceObj);
                  });
                });
                const list = serviceModified.filter((service1, idx1) => {
                  const idx2 = serviceModified.findIndex(
                    service2 => service1._id === service2._id);
                  return idx1 === idx2;
                });
                res.json({
                  results: list,
                });
              })
              .catch(e => next(e));
          })
          .catch(e => next(e));
      } else {
        next(result.array());
      }
    })
    .catch(e => next(e));
});


/**
 * Error handling Middlewares
 */

router.use(errorHandler);

module.exports = router;
