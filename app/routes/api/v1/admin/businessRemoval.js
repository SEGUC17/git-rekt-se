const express = require('express');
const bodyParser = require('body-parser');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;
const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const Branch = require('../../../../models/service/Branch');
const Strings = require('../../../../services/shared/Strings.js');
const errorHandler = require('../../../../services/shared/errorHandler');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const router = express.Router();

/**
 * Express Validator.
 */

router.use(expressValidator({}));

router.use(bodyParser.json());

router.post('/delete/:id', AdminAuth, (req, res, next) => {
  /**
   * check for services under this business and delete them first
   * also delete branches under the business
   */
  let i = 0;
  Service.find({
    _business: req.params.id,
  }, (err, results) => {
    for (i; i < results.length; i += 1) {
      results[i].remove();
    }
  });
  Branch.find({
    _business: req.params.id,
  }, (err2, results) => {
    for (i; i < results.length; i += 1) {
      results[i].remove();
    }
  });
  Business.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    return res.json({
      message: Strings.adminSuccess.businessDeleted,
    });
  });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
