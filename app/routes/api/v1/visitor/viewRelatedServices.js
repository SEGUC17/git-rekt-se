const express = require('express');
const bodyParser = require('body-parser');

const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Search for a service route
 */

router.get('/category/:id/:offset', (req, res, next) => {
  const offset = req.params.offset;
  Service.find(null, {
    _id: false,
  }, {
    skip: (offset - 1) * 10,
    limit: 10,
  })
    .populate('_business')
    .select('name shortDescription coverImage categories _business.name')
    .exec((finderr, services) => {
      if (finderr) {
        next(finderr);
      }

      /**
       * Filtering Services that only relate to the category in the params of the request
       */

      const filteredServices = services.filter((service) => {
        let hasService = false;
        service.categories.array.forEach((category) => {
          if (`${category}` === req.params.id) {
            hasService = true;
          }
        });
        return hasService;
      });

      if (filteredServices.length === 0) {
        return res.status(400)
          .json({
            errors: Strings.visitorErrors.NoRelatedServices,
          });
      }

      /**
       * Removing the categories array from the results
      */
      const serviceResults = filteredServices.map(service => ({
        name: service.name,
        shortDescription: service.shortDescription,
        coverImage: service.coverImage,
        /* eslint-disable no-underscore-dangle */
        businessname: service._business.name,
      }));
      return res.json({
        count: serviceResults.length,
        results: serviceResults,
      });
    });
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
