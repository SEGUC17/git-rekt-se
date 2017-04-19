const express = require('express');
const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');
const Branch = require('../../../../models/service/Branch');
const Services = require('../../../../models/service/Service');
const Business = require('../../../../models/business/Business');
const Review = require('../../../../models/service/Review');
const Category = require('../../../../models/service/Category');
const Offering = require('../../../../models/service/Offering');
const errorHandler = require('../../../../services/shared/errorHandler');


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
      path: 'reviews',
      match: {
        _deleted: false,
      },
      options: {
        populate: {
          path: '_client',
          select: 'firstName lastName',
        },
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
      if (!service) {
        next(Strings.serviceFailure.serviceNotFound);
        return;
      }
      const returnedService = {
        name: service.name,
        shortDescription: service.shortDescription,
        coverImage: service.coverImage,
        description: service.description,
        businessName: service._business.name,
        businessEmail: service._business.email,
        businessShortDescription: service._business.shortDescription,
        businessDescription: service._business.description,
        businessPhoneNumbers: service._business.phoneNumbers,
        businessGallery: service._business.gallery,
        businessWorkingHours: service._business.workingHours,
        branches: service.branches,
        offerings: service.offerings,
        reviews: service.reviews,
        rating: service._avgRating,
        gallery: service.gallery,
        categories: service.categories,
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

router.use(errorHandler);

module.exports = router;
