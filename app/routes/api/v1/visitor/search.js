const express = require('express');
const mongoose = require('mongoose');

const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');

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
        path: 'branch',
        match: {
          _deleted: false,
        },
      },
    })
    .find(mongooseQuery);
  // Executing
  fullQuery.count()
    .exec()
    .then((cnt) => {
      if (cnt === 0) {
        throw new Error(Strings.searchErrors.emptySearchResult);
      }
      res.json({
        count: cnt,
      });
      return fullQuery.populate('_business categories')
        .select('name shortDescription _business.name _avgRating categories.title')
        .skip(offset * 10)
        .limit(10)
        .exec();
    })
    .then((services) => {
      res.json.push({
        results: services,
      });
    })
    .catch((err) => { next([err]); });
});


/**
 *  Error Handling Middlewares.
 */

router.use((err, req, res) => {
  res.status(400)
    .json({
      errors: err,
    });
});
module.exports = router;
