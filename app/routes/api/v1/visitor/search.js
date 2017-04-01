const express = require('express');
const bodyParser = require('body-parser');

const Service = require('../../../../models/service/Service');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Search for a service route
 */

router.get('/search', (req, res, next) => {
  const inputQuery = req.query;
  const offset = (req.offset) ? req.offset : 0;
  const mongooseQuery1 = {
    deleted: false,
  };
  const mongooseQuery2 = {
    deleted: false,
  };
  const mongooseQuery3 = {
    deleted: false,
  };
  if (inputQuery.name) {
    mongooseQuery1.push({
      name: new RegExp(inputQuery.name, 'i'),
    });
  }
  if (inputQuery.rating) {
    mongooseQuery1.push({
      _avgRating: {
        $gte: inputQuery.rating,
      },
    });
  }
  if (inputQuery.min || inputQuery.max) {
    mongooseQuery2.push({
      price: {},
    });
  }
  if (inputQuery.min) {
    mongooseQuery2.price.push({
      $gte: inputQuery.min,
    });
  }
  if (inputQuery.max) {
    mongooseQuery2.price.push({
      $lte: inputQuery.max,
    });
  }
  if (inputQuery.location) {
    mongooseQuery3.push({
      location: inputQuery.location,
    });
  }
  const fullQuery = Service.find(mongooseQuery1)
    .populate({
      path: 'offerings',
      match: mongooseQuery2,
      populate: {
        path: 'branches',
        match: mongooseQuery3,
      },
    })
    .skip(offset * 10)
    .limit(10);
  fullQuery.count((err, cnt) => {
    fullQuery.exec((err2, services) => {
      if (err) {
        return next(err);
      }
      if (err2) {
        return next(err2);
      }
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
    });
  });
});

module.exports = router;
