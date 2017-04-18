const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const visitorValidator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const expressValidator = require('express-validator');
const errorHandler = require('../../../../services/shared/errorHandler');

mongoose.Promise = Promise;
const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * View Related Business route.
 */

router.get('/:id/:offset', (req, res, next) => {
  req.checkParams(visitorValidator.visitorValidation);
  req.getValidationResult()
        .then((result) => {
          if (result.isEmpty()) {
              const offset = req.params.offset;
              Business.count({
                  categories: {
                          $in: [req.params.id],
                        },
                  _deleted: false,
                })
                    .then((cnt) => {
                      Business.find({
                          categories: {
                                  $in: [req.params.id],
                                },
                          _deleted: false,
                        }, {
                              shortDescription: true,
                              name: true,
                              _id: true,
                            }, {
                              skip: (offset - 1) * 10,
                              limit: 10,
                            })
                            .exec()
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
                                  count: cnt,
                                  results: businesses,
                                });
                            })
                            .catch(err => next(err));
                    })
                    .catch(e => next(e));
            } else {
              next(result.array());
            }
        })
        .catch(e => next(e));
});

router.use(errorHandler);

module.exports = router;
