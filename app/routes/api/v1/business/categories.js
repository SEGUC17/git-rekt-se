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

router.get('/business', (req, res, next) => {
  Category.find({
    _deleted: false,
    type: 'Business',
  })
    .select('_id title')
<<<<<<< HEAD
=======
    .exec()
>>>>>>> 70bbda7c8ed15bb0c90610c76bb54aff213db4f9
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
