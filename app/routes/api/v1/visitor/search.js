const express = require('express');
const mongoose = require('mongoose');

const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');
const errorHandler = require('../../../../services/shared/errorHandler');
const locations = require('../../../../seed/service/locations');

const router = express.Router();

/**
 * Change Mongoose Promise Library with the default one.
 */
mongoose.Promise = Promise;

/**
 * Search For A Service API Route.
 */

router.get('/', (req, res, next) => {
  const inputQuery = req.query;
  const output = {};
  // Build up query
  const offset = (inputQuery.offset) ? inputQuery.offset : 1;
  const mongooseQuery = {
    _deleted: false,
  };
  if (inputQuery.name) {
    mongooseQuery.name = new RegExp(inputQuery.name, 'gi');
  }
  if (inputQuery.rating) {
    mongooseQuery._avgRating = {
      $gte: parseInt(inputQuery.rating, 10),
    };
  }
  // Check if query needs to check the offerings of the service
  if (inputQuery.min || inputQuery.max || inputQuery.location) {
    mongooseQuery.offerings = {
      $elemMatch: {
        _deleted: false,
      },
    };
  }
  if (inputQuery.min && inputQuery.max) {
    mongooseQuery.offerings.$elemMatch.price = {
      $gte: parseInt(inputQuery.min, 10),
      $lte: parseInt(inputQuery.max, 10),
    };
  } else if (inputQuery.min) {
    mongooseQuery.offerings.$elemMatch.price = {
      $gte: parseInt(inputQuery.min, 10),
    };
  } else if (inputQuery.max) {
    mongooseQuery.offerings.$elemMatch.price = {
      $lte: parseInt(inputQuery.max, 10),
    };
  }
  if (inputQuery.location) {
    mongooseQuery.offerings.$elemMatch.location = inputQuery.location;
  }
  if (inputQuery.category) {
    mongooseQuery.categories = {
      _id: inputQuery.category };
  }
  /**
   * Sorting Options (1: A-Z, 2:Desc. Rating)
   */
  let sort = '';
  if (inputQuery.sort === '2') {
    sort = '-_avgRating';
  } else {
    sort = 'name';
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
          select: 'name',
        }, {
          path: 'categories',
          match: {
            _deleted: false,
          },
          select: 'title',
        }])
        .select('name shortDescription _business _avgRating categories coverImage')
        .sort(sort)
        .skip((offset - 1) * 10)
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
 * Return a list of avaliable locations.
 */

router.get('/locations', (req, res, next) => {
  const locKeyValue = locations.map(loc => ({
    label: loc,
    value: loc,
  }));

  return res.json(locKeyValue);
});

/**
 *  Error Handling Middleware
 */

router.use(errorHandler);

module.exports = router;
