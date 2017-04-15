const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Review = require('../../../../models/service/Review');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');
const errorHandler = require('../../../../services/shared/errorHandler');

const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

router.post('/report/:id', authMiddleWare.clientAuthMiddleware, (req, res, next) => {
  Review.findOne({
    _id: req.params.ser_id,
  }, (err, result) => {
    if (err) {
      next(err);
      return;
    }
    result.reports.push(req.body.description);
    result.save((err2) => {
      if (err2) {
        return next(err2);
      }
      return res.json({
        message: Strings.clientSuccess.reviewReported,
      });
    });
  });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
