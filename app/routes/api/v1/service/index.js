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
 * View a service API Route.
 * `id`is the Service ID.
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
    },
    ])
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
        branches: service.branches,
        offerings: service.offerings.filter(offering => !offering._deleted),
        reviews: service.reviews,
        rating: service._avgRating,
        gallery: service.gallery,
        categories: service.categories,
      };

      if (service._business) {
        returnedService.businessName = service._business.name;
        returnedService.businessId = service._business._id;
      }

      res.json(returnedService);
    })
    .catch((e) => {
      next(e);
    });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
