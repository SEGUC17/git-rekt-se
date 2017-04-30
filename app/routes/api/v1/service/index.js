const express = require('express');
const passport = require('passport');

const Service = require('../../../../models/service/Service');
const Statistics = require('../../../../models/service/Statistics');
const Strings = require('../../../../services/shared/Strings');

const errorHandler = require('../../../../services/shared/errorHandler');
const jwtConfig = require('../../../../services/shared/jwtConfig');

const router = express.Router();

/**
 * View a service API Route.
 * `id`is the Service ID.
 */


router.get('/:id', jwtConfig.statsMiddleware, (req, res, next) => {
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
    });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
