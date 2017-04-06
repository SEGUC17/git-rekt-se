const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const Schema = mongoose.Schema;

const Branch = require('../../../../models/service/Branch');
const Business = require('../../../../models/business/Business');
const businessMessages = require('../../../../services/shared/Strings')
  .businessMessages;
const businessSuccess = require('../../../../services/shared/Strings')
  .businessSuccess;
const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const businessValidation = require('../../../../services/shared/validation');
const businessUtils = require('../../../../services/business/businessUtils');
const errorHandler = require('../../../../services/shared/errorHandler');

mongoose.Promise = Promise;
const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Business Edit Info API Route.
 */

router.put('/edit/:id', businessAuthMiddleware, (req, res, next) => {
  const id = req.params.id;
  if (req.user.id !== id) {
    next([businessMessages.mismatchID]);
  } else {
    const body = req.body;
    const searchID = {
      _id: id,
    };
    req.checkBody(businessValidation.businessEditInfoValidation);
    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
          Business.findOne(searchID)
            .exec()
            .then((business) => {
              if (!business) {
                next([businessMessages.businessDoesntExist]);
              } else {
                business.workingHours = body.workingHours;
                business.description = body.description;
                business.categories = body.categories
                  .filter((category, index, self) => self.indexOf(category) === index)
                  .map(category =>
                    new Schema.Types.ObjectId(category)
                    .path);
                business.save()
                  .then(() => res.json({
                    message: businessSuccess.infoEditSuccess,
                  }))
                  .catch(err => next(err));
              }
            })
            .catch(err => next(err));
        } else {
          next(result.array());
        }
      })
      .catch(err => next(err));
  }
});

/**
 * Business Add Branches API Route.
 */

router.post('/:id/add/branches', businessAuthMiddleware, (req, res, next) => {
  const id = req.params.id;
  if (req.user.id !== id) {
    next([businessMessages.mismatchID]);
  } else {
    const searchID = {
      _id: id,
    };
    req.checkBody(businessValidation.businessAddValidation);
    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
          businessUtils.addBranches(req.body.branches, id)
            .then((branches) => {
              Business.findOne(searchID)
                .exec()
                .then((business) => {
                  if (!business) {
                    next([businessMessages.businessDoesntExist]);
                  } else {
                    business.branches = business.branches.concat(branches);
                    business.save()
                      .then(() => res.json({
                        message: businessSuccess.branchAddedSuccess,
                      }))
                      .catch(err => next(err));
                  }
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        } else {
          next(result.array());
        }
      })
      .catch(err => next(err));
  }
});

/**
 * Business Edit Branch API Route.
 */

router.put('/:business_id/edit/branch/:branch_id', businessAuthMiddleware, (req, res, next) => {
  const id = req.params.business_id;
  if (req.user.id !== id) {
    next([businessMessages.mismatchID]);
  } else {
    req.checkBody(businessValidation.businessEditValidation);
    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
          const branchID = req.params.branch_id;
          const searchID = {
            _id: branchID,
          };
          Branch.findOne(searchID)
            .exec()
            .then((branch) => {
              if (!branch || branch._deleted) {
                next([businessMessages.branchDoesntExist]);
              } else if (branch._business.equals(id)) {
                branch.location = req.body.branch.location;
                branch.address = req.body.branch.address;
                branch.save()
                  .then(() => res.json({
                    message: businessSuccess.branchEditSuccess,
                  }))
                  .catch(err => next(err));
              } else {
                next([businessMessages.mismatchID]);
              }
            })
            .catch(err => next(err));
        } else {
          next(result.array());
        }
      })
      .catch(err => next(err));
  }
});

/**
 * Business Delete Branch API Route.
 */

router.delete('/:business_id/delete/branch/:branch_id', businessAuthMiddleware, (req, res, next) => {
  const id = req.params.business_id;
  if (req.user.id !== id) {
    next([businessMessages.mismatchID]);
  } else {
    const searchID = {
      _id: req.params.branch_id,
    };
    Branch.findOne(searchID)
      .exec()
      .then((branch) => {
        if (!branch || branch._deleted) {
          next([businessMessages.branchDoesntExist]);
        } else if (branch._business.equals(id)) {
          branch._deleted = true;
          branch.save()
            .then(() => res.json({
              message: businessSuccess.branchDeleteSuccess,
            }))
            .catch(err => next(err));
        } else {
          next([businessMessages.mismatchID]);
        }
      })
      .catch(err => next(err));
  }
});

/**
 * Error Handling Middleware
 */

router.use(errorHandler);

module.exports = router;
