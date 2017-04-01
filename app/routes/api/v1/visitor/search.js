const express = require('express');
const mongoose = require('mongoose');

const Service = require('../../../../models/service/Service');

const router = express.Router();
mongoose.Promise = Promise;
/**
 * Search for a service route
 */

router.get('/search', (req, res, next) => {
  const inputQuery = req.query;
  // Build up query
  const offset = (inputQuery.offset) ? inputQuery.offset : 0;
  const mongooseQuery = {
    _deleted: false,
  };
  if (inputQuery.name) {
    mongooseQuery.push({
      name: new RegExp(inputQuery.name, 'i'),
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
        $elemMatch: {},
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
      business: {
        location: inputQuery.location,
      },
    });
  }
  // Query to execute
  const fullQuery = Service
    .populate({
      path: 'offerings',
      match: {
        _deleted: false,
      },
      populate: {
        path: 'branches',
        match: {
          _deleted: false,
        },
      },
    })
    .find(mongooseQuery)
    .skip(offset * 10)
    .limit(10);
  // Executing
  fullQuery.count()
    .exec()
    .then((cnt) => {
      fullQuery.populate('_business categories')
        .select('name shortDescription _business.name _avgRating categories.title')
        .exec()
        .then((services) => {
          if (cnt === 0) {
            res.status(400);
            return res.json({
              Error: 'No search results match the query.',
            });
          }
          return res.json({
            count: cnt,
            results: services,
          });
        })
        .catch(err => next([err]));
    });
});

module.exports = router;
