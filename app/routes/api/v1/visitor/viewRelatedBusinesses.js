const express = require('express');
const bodyParser = require('body-parser');

const Business = require('../../../../models/business/Business');

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

  Business.find(null, {
    shortDescription: true,
    name: true,
    categories: true,
    _id: false,
  }, {
    skip: (offset - 1) * 10,
    limit: 10,
  })
    .exec((finderr, businesses) => {
      if (finderr) {
        next(finderr);
      }
      const filteredBusinesses = businesses.filter((business) => {
        let hascategory = false;
        business.categories.forEach((category) => {
          /* eslint-disable no-underscore-dangle */
          if (`${category}` === req.params.id) {
            hascategory = true;
          }
        });
        return hascategory;
      });
      if (filteredBusinesses.length === 0) {
        return res.status(400).json({
          errors: 'No related businesses',
        });
      }
      return res.json({
        count: filteredBusinesses.length,
        results: filteredBusinesses,
      });
    });
});


/**
 * Error handling Middlewares
 */

router.use((err, req, res) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;
