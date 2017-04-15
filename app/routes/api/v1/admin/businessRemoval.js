const express = require('express');
const bodyParser = require('body-parser');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;
const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const Branch = require('../../../../models/service/Branch');
const Offering = require('../../../../models/service/Offering');
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
  const branchlist = [];
  Service.find({
    _business: req.params.id,
  }, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    for (i; i < results.length; i += 1) {
      results[i]._deleted = true;
    }
  });
  Branch.find({
    _business: req.params.id,
  }, (err2, results) => {
    if (err2) {
      next(err2);
      return;
    }
    for (i; i < results.length; i += 1) {
      branchlist[i] = results[i]; // save to a const to not create a function inside this loop
      results[i]._deleted = true;
    }
  });

  branchlist.forEach((branch) => {
    Offering.find({
      branch: branch.id,
    }, (err3, results2) => {
      if (err3) {
        next(err3);
        return;
      }
      for (i; i < results2.length; i += 1) {
        results2[i]._deleted = true;
      }
    });
  });

  Business.findByIdAndRemove(req.params.id, (err4) => {
    if (err4) {
      return next(err4);
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
