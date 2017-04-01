const express = require('express');
const bodyParser = require('body-parser');
const Business = require('../../../../models/business/Business');

const router = express.Router();

/**
 * Body-Parser Middleware
 */

router.use(bodyParser.json);

/**
 * View Related Business route
 */

router.get('/category/:id/:offset', (req, res, next) => {
  const categoryId = req.params.id;
  const offset = req.params.offset;
  Business.count({ categories: {
    $not: {
      $size: 0,
    },
    $in: {
      categoryId,
    },
  } }, (err, cnt) => {
    if (err) {
      next(err);
    }
    Business.find({
      categories: {
        $not: {
          $size: 0,
        },
        $in: {
          categoryId,
        },
      },
    }, {
      shortDescription: 1,
      name: 1,
    }, {
      skip: offset * 10,
      limit: 10,
    })
    .exec((err2, businesses) => {
      if (err2) {
        return next(err);
      }
      if (cnt === 0) {
        return res.status(400).json({
          errors: 'No related businesses',
        });
      }
      return res.json({
        count: cnt,
        results: businesses,
      });
    });
  });
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
