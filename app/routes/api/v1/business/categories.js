const express = require('express');
const bodyParser = require('body-parser');

const Category = require('../../../../models/service/Category');

const errorHandler = require('../../../../services/shared/errorHandler');

const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());

/**
 * Get all the business categories
 */

router.get('/test', (req, res, next) => {
  console.log(11);
  const categories = [{
    type: 'Business',
    title: 'Self Development',
  }, {
    type: 'Business',
    title: 'Langauge Courses',
  }, {
    type: 'Business',
    title: 'German Courses',
  }, {
    type: 'Business',
    title: 'English Courses',
  }, {
    type: 'Business',
    title: 'Team Management',
  }, {
    type: 'Business',
    title: 'Enhance',
  }];
  Category.insertMany(categories)
    .then(() => res.json({
      message: 'done',
    }))
    .catch(e => next([e]));
});

router.get('/business', (req, res, next) => {
  Category.find({
    _deleted: false,
    type: 'Business',
  })
    .select('_id title')
    .then(categories => res.json({
      results: categories,
    }))
    .catch(e => next([e]));
});

/**
 * Error handling Middlewares
 */

router.use(errorHandler);

module.exports = router;
