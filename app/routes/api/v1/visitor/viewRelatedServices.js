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

router.get('/category/:id/:offset', (req, res, next) => {
  const categoryId = req.params.id;
  const offset = req.params.offset;
  Service.count({
    categories: {
      $not: {
        $size: 0,
      },
      $in: {
        categoryId,
      },
    },
  }, (err, cnt) => {
    if (err) {
      next(err);
    }
    Service.find({
      categories: {
        $not: {
          $size: 0,
        },
        $in: {
          categoryId,
        },
      },
    }, null, {
      skip: offset * 10,
      limit: 10,
    })
      .populate('_business')
      .select('name shortDescription _business.name _avgRating coverImage')
      .exec((errfind, services) => {
        if (errfind) {
          next(err);
        }
        if (cnt === 0) {
          return res.status(400)
            .json({
              errors: 'No related Services',
            });
        }
        return res.json({
          count: cnt,
          results: services,
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
