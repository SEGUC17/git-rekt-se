const express = require('express');
const bodyParser = require('body-parser');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;

const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const Branch = require('../../../../models/service/Branch');

const Strings = require('../../../../services/shared/Strings.js');
const errorHandler = require('../../../../services/shared/errorHandler');
const validationSchemas = require('../../../../services/shared/validation');
const AdminUtils = require('../../../../services/admin/AdminUtils');

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
  req.checkParams(validationSchemas.businessdeletionValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        const businessID = req.params.id;
        Business.findOne({
          _id: businessID,
        }).then((business) => {
          if (!business || business._status !== 'verified') {
            next([Strings.adminValidationErrors.invalidBusinessID]);
          } else if (business._deleted) {
            next([Strings.adminFailures.businessAlreadyDeleted]);
          } else {
            Service.find({
              _business: businessID,
            })
          .then((services) => {
            AdminUtils.deleteServices(services)
              .then((resultServices) => {
                Branch.find({
                  _business: businessID,
                }).then((branches) => {
                  AdminUtils.deleteBranches(branches).then((resultBranches) => {
                    business._deleted = true;
                    business.save().then(() => res.json({
                      message: Strings.adminSuccess.businessDeleted,
                    })).catch(e => next([e]));
                  }).catch(e => next([e]));
                }).catch(e => next([e]));
              })
              .catch(e => next([e]));
          })
          .catch(e => next([e]));
          }
        }).catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next(err));
});

router.get('/list', AdminAuth, (req, res, next) => {
  Business.find({
    _deleted: false,
    _status: 'verified',
  }, {
    name: true,
    email: true,
  })
    .then(businesses => res.json({
      results: businesses,
    }))
    .catch(e => next([e]));
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
