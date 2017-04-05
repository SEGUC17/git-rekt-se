const express = require('express');
const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');
const Branch = require('../../../../models/service/Branch');
const Services = require('../../../../models/service/Service');
const Business = require('../../../../models/business/Business');
const Review = require('../../../../models/service/Review');
const Category = require('../../../../models/service/Category');
const Offering = require('../../../../models/service/Offering');


const router = express.Router();

/**
 * View a service route
 */


router.get('/:id', (req, res, next) => {
  Service.findOne({
    _id: req.params.id,
    _deleted: false,
  })
    .populate([{
      path: '_business',
      match: {
        _deleted: false,
      },
    },
    {
      path: 'branches',
      match: {
        _deleted: false,
      },
    },
    {
      path: 'offerings',
      match: {
        _deleted: false,
      },
    },
    {
      path: 'reviews',
      match: {
        _deleted: false,
      },
    },
    {
      path: 'categories',
      match: {
        _deleted: false,
      },
    }])
    .exec()
    .then((service) => {
      const returnedService = {
        name: service.name,
        shortDescription: service.shortDescription,
        description: service.description,
        businessName: service._business.name,
        businessEmail: service._business.service,
        businessShortDescription: service._business.shortDescription,
        businessDescription: service._business.description,
        businessPhoneNumbers: service._business.phoneNumbers,
        businessGallery: service._business.gallery,
        businessWorkingHours: service._business.workingHours,
        branches: service.branches,
        offerings: service.offerings,
        reviews: service.reviews,
        gallery: service.gallery,
      };
      res.json(returnedService);
    })
    .catch(() => {
      next(Strings.serviceFailure.serviceNotFound);
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
