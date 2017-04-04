const express = require('express');
const bodyParser = require('body-parser');
const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const Branch = require('../../../../models/service/Branch');
const Offering = require('../../../../models/service/Offering');
const Strings = require('../../../../services/shared/Strings');

const router = express.Router();

/**
 * View a service route
 */

router.get('/:id', (req, res, next) => {
  Service.findOne({
    _id: req.params.id,
  })
    .populate('_business branches categories reviews')
    .exec()
    .then((service) => {
      const returnedService = {
        name: service.name,
        shortDescription: service.shortDescription,
        description: service.description,
        businessName: service.business.name,
        businessEmail: service.business.service,
        businessShortDescription: service.business.shortDescription,
        businessDescription: service.business.description,
        businessPhoneNumbers: service.business.phoneNumbers,
        businessGallery: service.business.gallery,
        businessWorkingHours: service.business,
        // branches:
        // offerings:
        // reviews:
        // gallery

      };
      res.json(service);
    })
    .catch((err) => {
      res.json({ message: Strings.serviceFailure.serviceNotFound });
    });
});

/**
 *  Error Handling Middlewares.
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;
