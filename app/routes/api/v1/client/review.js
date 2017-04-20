const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Review = require('../../../../models/service/Review');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');
const errorHandler = require('../../../../services/shared/errorHandler');
const validator = require('../../../../services/shared/validation');

const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

router.post('/report/:id', authMiddleWare.clientAuthMiddleware, (req, res, next) => {
  req.checkParams(validator.adminReviewValidation);
  req.getValidationResult()
        .then((result) => {
          if (result.isEmpty()) {
            Review.findOne({
              _id: req.params.id,
            }, (err, result2) => {
              if (err) {
                next(err);
                return;
              }
              if (!result2 || result2._deleted) {
                next(Strings.reviewErrors.reviewFalure);
                return;
              }
              result2.reports += 1;
              result2.save((err2) => {
                if (err2) {
                  return next(err2);
                }
                return res.json({
                  message: Strings.clientSuccess.reviewReported,
                });
              });
            });
          } else {
            next(result.array());
          }
        })
        .catch(e => next([e]));
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
