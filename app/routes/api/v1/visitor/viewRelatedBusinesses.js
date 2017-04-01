const express = require('express');
const bodyParser = require('body-parser');
const Business = require('../../../../models/business');

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
      _deleted: 0,
      gallery: 0,
      password: 0,
    }, {
      skip: offset * 10,
      limit: 10,
    })
    .populate('branches', 'location address')
    .populate('categories', 'title icon')
    .exec((err2, businesses) => {
      if (err2) {
        return next(err);
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
