const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business');
const visitorValidator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const expressValidator = require('express-validator');
const errorHandler = require('../../../../services/shared/errorHandler');
const businessUtils = require('../../../../services/business/businessUtils');

mongoose.Promise = Promise;
const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));


router.get('/related/:id', (req, res, next) => {
  req.checkParams(visitorValidator.relatedBusinessValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Business.findOne({
          _id: req.params.id,
        })
          .then((resultBusiness) => {
            businessUtils.getRelatedBusinesses(resultBusiness.categories, req.params.id)
              .then((businesses) => {
                const businessModified = [];
                businesses.forEach((business) => {
                  business.forEach((businessObj) => {
                    businessModified.push(businessObj);
                  });
                });
                const list = businessModified.filter((business1, idx1) => {
                  const idx2 = businessModified.findIndex(
                    business2 => business1._id === business2._id);
                  return idx1 === idx2;
                });
                res.json({
                  results: list,
                });
              })
              .catch(e => next(e));
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
