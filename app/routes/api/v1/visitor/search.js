const express = require('express');
const mongoose = require('mongoose');

const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');
const errorHandler = require('../../../../services/shared/errorHandler');

const router = express.Router();
mongoose.Promise = Promise;
/**
 * Search for a service route
 */

router.get('/', (req, res, next) => {
  const inputQuery = req.query;
  const output = {};
  // Build up query
  const offset = (inputQuery.offset) ? inputQuery.offset : 0;
  const mongooseQuery = {
    _deleted: false,
  };
  if (inputQuery.name) {
    mongooseQuery.push({
      name: new RegExp(inputQuery.name, 'gi'),
    });
  }
  if (inputQuery.rating) {
    mongooseQuery.push({
      _avgRating: {
        $gte: inputQuery.rating,
      },
    });
  }
  // Check if query needs to check the offerings of the service
  if (inputQuery.min || inputQuery.max || inputQuery.location) {
    mongooseQuery.push({
      offerings: {
        $elemMatch: {
          _deleted: false,
        },
      },
    });
  }
  if (inputQuery.min || inputQuery.max) {
    mongooseQuery.offerings.$elemMatch.push({
      price: {},
    });
  }
  if (inputQuery.min) {
    mongooseQuery.offerings.$elemMatch.price.push({
      $gte: inputQuery.min,
    });
  }
  if (inputQuery.max) {
    mongooseQuery.offerings.$elemMatch.price.push({
      $lte: inputQuery.max,
    });
  }
  if (inputQuery.location) {
    mongooseQuery.offerings.$elemMatch.push({
      branch: {
        location: new RegExp(inputQuery.location, 'i'),
      },
    });
  }

  // Executing
  Service
    .find(mongooseQuery)
    .count()
    .exec()
    .then((cnt) => {
      if (cnt === 0) {
        next(Strings.searchErrors.emptySearchResult);
        return;
      }
      output.count = cnt;
      Service
        .find(mongooseQuery)
        .populate([{
          path: '_business',
          match: {
            _deleted: false,
          },
          select: 'name',
        }, {
          path: 'categories',
          match: {
            _deleted: false,
          },
          select: 'type',
        }])
        .select('name shortDescription _business _avgRating categories coverImage')
        .skip(offset * 10)
        .limit(10)
        .exec((err, services) => {
          if (err) {
            next(err);
            return;
          }
          output.results = services;
          res.json(output);
        });
    });
});

/**
 *  Error Handling Middleware
 */

router.use(errorHandler);

module.exports = router;
