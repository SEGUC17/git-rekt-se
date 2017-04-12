const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Review = require('../../../../models/service/Review');
const ClientAuthenticator = require('../../../../services/client/ClientAuthenticator');
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
      return next(err);
    }
    result.reports.push(req.body.description);
    return res.json({
      message: Strings.clientSuccess.reviewReported,
    });
  });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
