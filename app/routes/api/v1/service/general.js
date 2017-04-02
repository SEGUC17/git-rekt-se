const express = require('express');
const bodyParser = require('body-parser');

const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Search for a service route
 */

router.get('/category/:id/:offset', (req, res, next) => {
  const offset = req.params.offset;
  Service.find({
    categories: {
      $in: [req.params.id],
    },
  }, null, {
    skip: (offset - 1) * 10,
    limit: 10,
  })
    .populate('_business')
    .select('name shortDescription coverImage _business.name -_id')
    .exec((finderr, services) => {
      if (finderr) {
        next(finderr);
      }
      if (services.length === 0) {
        return next([Strings.visitorErrors.NoRelatedServices]);
      }
      return res.json({
        count: services.length,
        results: services,
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
