const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Business = require('../../../../models/business/Business');
const Strings = require('../../../../services/shared/Strings');

mongoose.Promise = Promise;

const router = express.Router();

/**
 * Body-Parser Middleware
 */

router.use(bodyParser.json());

/**
 * View Related Business route
 */

router.get('/category/:id/:offset', (req, res, next) => {
  const offset = req.params.offset;

  Business.find({
    categories: {
      $in: [req.params.id],
    },
  }, {
    shortDescription: true,
    name: true,
    _id: false,
  }, {
    skip: (offset - 1) * 10,
    limit: 10,
  }).exec()
    .then((businesses) => {
      /**
       * In case of No related businesses in the category specified in the params
       */

      if (businesses.length === 0) {
        return next([Strings.visitorErrors.NoRelatedBusinesses]);
      }

      /**
       * JSON response sent including the list of the businesses along with their count
       */
      return res.json({
        count: businesses.length,
        results: businesses,
      });
    })
    .catch(err => next([err]));
});


/**
 * Error handling Middlewares
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;
