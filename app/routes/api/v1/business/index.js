const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const visitorValidator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const expressValidator = require('express-validator');
const errorHandler = require('../../../../services/shared/errorHandler');

mongoose.Promise = Promise;
const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * View business page.
 */

router.get('/:id', (req, res, next) => {
  let returnedBusiness;

  console.log('hoba');

  Business.findOne({
    _id: req.params.id,
    _deleted: false,
    _status: 'verified',
  }, {
    password: false,
    _deleted: false,
  })
        .populate([{
          path: 'branches',
          match: {
            _deleted: false,
          },
        }, {
          path: 'categories',
          match: {
            _deleted: false,
          },
        }])
        .exec()
        .then((business) => {
          if (!business) {
            next(Strings.businessConfirmation.notFound);
            return;
          }

          returnedBusiness = {
            _id: business.id,
            name: business.name,
            email: business.email,
            shortDescription: business.shortDescription,
            gallery: business.gallery,
            phoneNumbers: business.phoneNumbers,
            description: business.description,
            workingHours: business.workingHours,
            categories: business.categories,
            branches: business.branches,
          };

          Service.find({
            _business: business._id,
            _deleted: false,
          })
                .populate([{
                  path: 'branches',
                  match: {
                    _deleted: false,
                  },
                }, {
                  path: 'reviews',
                  match: {
                    _deleted: false,
                  },
                }])
                .exec()
                .then((businessServices) => {
                  returnedBusiness.services = businessServices;
                  res.json(returnedBusiness);
                })
                .catch(e => next(e));
        })
        .catch((err) => {
          next(err);
        });
});

router.use(errorHandler);

module.exports = router;
