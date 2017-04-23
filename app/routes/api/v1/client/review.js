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

/**
 * Client Report Review Route.
 * @param {id} Review Id.
 */

router.post('/report/:id', authMiddleWare.clientAuthMiddleware, (req, res, next) => {
  req.checkParams(validator.clientReviewValidation);
  req.getValidationResult()
        .then((result) => {
          if (result.isEmpty()) {
            const reviewID = req.params.id;
            Review.findOne({
              _id: reviewID,
            }).then((review) => {
              if (review) {
                if (review._deleted) {
                  next([Strings.reviewErrors.reviewIsDeleted]);
                } else {
                  review.reports += 1;
                  review.save().then(() => res.json({
                    message: Strings.clientSuccess.reviewReported,
                  })).catch(e => next([e]));
                }
              } else {
                next([Strings.reviewErrors.reviewFaliure]);
              }
            }).catch(e => next([e]));
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
