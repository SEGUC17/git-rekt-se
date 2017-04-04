const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');
const validationSchemas = require('../../../../services/shared/validation');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Express Validator Middleware
 */

router.use(expressValidator({}));

/**
 * Search for a service route
 */

router.get('/category/:id/:offset', (req, res, next) => {
  req.checkParams(validationSchemas.visitorValidation).then((result) => {
    if (result.isEmpty()) {
      const offset = req.params.offset;
      Service.count({
        categories: {
          $in: [req.params.id],
        },
        _deleted: false,
      }).then((cnt) => {
        Service.find({
          categories: {
            $in: [req.params.id],
          },
          _deleted: false,
        }, {
          name: true,
          shortDescription: true,
          coverImage: true,
          _business: true,
          _id: false,
        }, {
          skip: (offset - 1) * 10,
          limit: 10,
        })
    .populate({
      path: '_business',
      select: 'name -_id',
    })
    .exec()
    .then((services) => {
      if (services.length === 0) {
        return next([Strings.visitorErrors.NoRelatedServices]);
      }
      return res.json({
        count: cnt,
        results: services,
      });
    })
    .catch(err => next([err]));
      }).catch(e => next([e]));
    } else {
      next(result.array());
    }
  }).catch(e => next([e]));
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
