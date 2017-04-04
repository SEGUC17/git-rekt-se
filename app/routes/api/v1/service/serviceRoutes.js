const express = require('express');
const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');

const router = express.Router();

/**
 * View a service route
 */

router.get('/:id', (req, res, next) => {
  const pattern = new RegExp('/^[0-9a-fA-F]{24}$/');
  const isValidId = pattern.test(req.params.id);
  if (isValidId) {
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
        businessWorkingHours: service.business.businessWorkingHours,
        branches: service.branches,
        offerings: service.offerings,
        reviews: service.reviews,
        gallery: service.gallery,
      };
      res.json(returnedService);
    })
    .catch((err) => {
      res.json({ message: Strings.serviceFailure.serviceNotFound });
    });
  }
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
