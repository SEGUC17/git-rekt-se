const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const Service = require('../../../../models/service/Service');
const Offering = require('../../../../models/service/Offering');
const Branch = require('../../../../models/service/Branch');

const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const validator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const createServiceUtils = require('../../../../services/business/createServiceUtils');
const errorHandler = require('../../../../services/shared/errorHandler');

mongoose.Promise = Promise;

const router = express.Router();

/*
    Multer Config.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${__dirname}/uploads`);
  },
  filename(req, file, cb) {
    const buf = crypto.randomBytes(48);
    cb(null, Date.now() + buf.toString('hex') + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Express Validator Middleware
 */

router.use(expressValidator({}));

/**
 * Category CRUD routes
 */

/**
 * Business create a service
 */

router.post('/create', businessAuthMiddleware, upload.single('coverImage'), (req, res, next) => {
  /**
   * Form validation
   */
  req.checkBody(validator.serviceCreateValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        /**
         * Validation passed
         */
        const reqData = {
          name: req.body.name,
          shortDescription: req.body.shortDescription,
          description: req.body.description ? req.body.description : '',
          categories: req.body.categories ? req.body.categories : [],
        };

        /**
         * Checking category IDs are invalid or not
         */
        createServiceUtils.checkCategories(reqData.categories)
          .then((categories) => {
            let valid = true;
            categories.forEach((category) => {
              if (!category) {
                valid = false;
              }
            });
            if (valid) {
              /**
               * Saving the serivce to the service collection
               */
              const service = new Service({
                name: reqData.name,
                shortDescription: reqData.shortDescription,
                description: reqData.description,
                categories: reqData.categories,
                _business: req.user._id,
                coverImage: req.file ? req.file.filename : undefined,
              });
              service.save()
                .then(doc => res.json({
                  message: Strings.serviceSuccess.serviceAdded,
                }))
                .catch(e => next([e]));
            } else {
              next([Strings.serviceValidationCRUDErrors.invalidCategory]);
            }
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 * Business create offering
 */

router.post('/:id/offering/create', businessAuthMiddleware, (req, res, next) => {
  /**
   * Form validation
   */
  req.checkBody(validator.offeringCreateValidationBody);
  req.checkParams(validator.ServiceCreateValidationParams);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        /**
         * Validation passed
         */
        const reqData = {
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          branch: req.body.branch,
          price: req.body.price,
        };

        Service.findOne({
          _id: req.params.id,
          _deleted: false,
        })
          .then((service) => {
            if (service) {
              if (service._business.equals(req.user._id)) {
                const business = req.user;
                let valid = false;
                business.branches.forEach((branch) => {
                  if (reqData.branch === `${branch}`) {
                    valid = true;
                  }
                });
                if (valid) {
                  Branch.findOne({
                    _id: reqData.branch,
                  })
                    .then((branchAdded) => {
                      const offering = new Offering({
                        startDate: reqData.startDate,
                        endDate: reqData.endDate,
                        location: branchAdded.location,
                        branch: reqData.branch,
                        price: reqData.price,
                        address: branchAdded.address,
                      });
                      offering.save()
                        .then((offer) => {
                          service.offerings.push(offer);
                          /**
                           * Check whether this branch is in the list of branches in service object
                           */
                          let exist = false;
                          service.branches.forEach((branch) => {
                            if (branch.equals(offer.branch)) {
                              exist = true;
                            }
                          });
                          if (!exist) {
                            service.branches.push(offer.branch);
                          }

                          service.save()
                            .then((addedService) => {
                              res.json({
                                message: Strings.serviceSuccess.offeringAdded,

                              });
                            })
                            .catch(e => next([e]));
                        })
                        .catch(e => next([e]));
                    })
                    .catch(e => next([e]));
                } else {
                  next([Strings.offeringValidationError.invalidBranch]);
                }
              } else {
                /**
                 * business doesn't own this particular service to edit it
                 */
                next([Strings.offeringValidationError.invalidOperation]);
              }
            } else {
              /**
               * No service with the id in the request params
               */
              next([Strings.offeringValidationError.invalidService]);
            }
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});


/**
 * Business edit a service
 */

router.post('/:id/edit', businessAuthMiddleware, upload.single('coverImage'), (req, res, next) => {
  /**
   * Form validation
   */
  req.checkParams(validator.ServiceCreateValidationParams);
  req.checkBody(validator.serviceCreateValidation);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        /**
         * Validation passed
         */
        const reqData = {
          name: req.body.name,
          shortDescription: req.body.shortDescription,
          description: req.body.description ? req.body.description : '',
          categories: req.body.categories ? req.body.categories : [],
        };

        /**
         * Checking category IDs are invalid or not
         */

        createServiceUtils.checkCategories(reqData.categories)
          .then((categories) => {
            let valid = true;
            categories.forEach((category) => {
              if (!category) {
                valid = false;
              }
            });
            if (valid) {
              Service.findOne({
                _id: req.params.id,
                _deleted: false,
              })
                .then((service) => {
                  if (!service) {
                    next([Strings.offeringValidationError.invalidService]);
                  } else if (service._business.equals(req.user._id)) {
                    service.name = reqData.name;
                    service.shortDescription = reqData.shortDescription;
                    service.description = reqData.description;
                    service.categories = reqData.categories;
                    service._business = req.user._id;
                    service.coverImage = req.file ? req.file.filename : undefined;
                    service.save()
                      .then((addedService) => {
                        res.json({
                          message: Strings.serviceSuccess.serviceEdited,
                        });
                      })
                      .catch(e => next(e));
                  } else {
                    next([Strings.offeringValidationError.invalidOperation]);
                  }
                })
                .catch(e => next([e]));
            } else {
              next([Strings.serviceValidationCRUDErrors.invalidCategory]);
            }
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 * Business edit offering
 * id1 is the service id
 * id2 is the id of offering
 */

router.post('/:id1/offering/:id2/edit', businessAuthMiddleware, (req, res, next) => {
  /**
   * Form validation
   */
  req.checkBody(validator.offeringCreateValidationBody);
  req.checkParams(validator.offeringEditValidationParmas);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        /**
         * Validation passed
         */
        const serviceID = req.params.id1;
        const offeringID = req.params.id2;
        Branch.findOne({
          _id: req.body.branch,
        })
          .then((branchDoc) => {
            const reqData = {
              startDate: req.body.startDate,
              endDate: req.body.endDate,
              location: branchDoc.location,
              branch: req.body.branch,
              price: req.body.price,
              address: branchDoc.address,
            };
            Service.findOne({
              _id: serviceID,
              _deleted: false,
            })
              .then((service) => {
                if (service) {
                  if (service._business.equals(req.user._id)) {
                    const business = req.user;
                    let validBranch = false;
                    business.branches.forEach((branch) => {
                      if (reqData.branch === `${branch}`) {
                        validBranch = true;
                      }
                    });
                    if (validBranch) {
                      let validOffering = false;
                      let object;
                      service.offerings.forEach((offering) => {
                        if (`${offering._id}` === offeringID) {
                          validOffering = true;
                          object = offering;
                        }
                      });
                      if (validOffering) {
                        const oldbranch = object.branch;
                        Offering.findOne({
                          _id: offeringID,
                        })
                          .then((offeringDoc) => {
                            offeringDoc.startDate = reqData.startDate;
                            offeringDoc.endDate = reqData.endDate;
                            offeringDoc.location = reqData.location;
                            offeringDoc.branch = reqData.branch;
                            offeringDoc.price = reqData.price;
                            offeringDoc.address = reqData.address;
                            offeringDoc.save()
                              .then((offer) => {
                                let oldexist = false; // old branch before edit exist

                                service.offerings.forEach((offering) => {
                                  if (offering.branch === oldbranch && offeringID !== `${offering._id}`) {
                                    oldexist = true;
                                  }
                                });

                                const newBranches = []; // new list of branches for the service
                                newBranches.push(reqData.branch);
                                service.branches.forEach((branch) => {
                                  if (branch.equals(oldbranch)) {
                                    if (oldexist) {
                                      newBranches.push(branch);
                                    }
                                  } else if (`${branch}` !== reqData.branch) {
                                    newBranches.push(branch);
                                  }
                                });

                                service.branches = newBranches;
                                service.save()
                                  .then(addedService => res.json({
                                    message: Strings.serviceSuccess.offeringEdited,
                                  }))
                                  .catch((e) => {
                                    next([e]);
                                  });
                              })
                              .catch(e => next([e]));
                          })
                          .catch((e => next([e])));
                      } else {
                        next([Strings.offeringValidationError.invalidOffering]);
                      }
                    } else {
                      next([Strings.offeringValidationError.invalidBranch]);
                    }
                  } else {
                    /**
                     * business doesn't own this particular service to edit it
                     */
                    next([Strings.offeringValidationError.invalidOperation]);
                  }
                } else {
                  /**
                   * No service with the id in the request params
                   */
                  next([Strings.offeringValidationError.invalidService]);
                }
              })
              .catch(e => next([e]));
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 * Business delete service
 */

router.post('/:id/delete', businessAuthMiddleware, (req, res, next) => {
  req.checkParams(validator.ServiceCreateValidationParams);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        const serviceID = req.params.id;
        Service.findOne({
          _id: serviceID,
          _deleted: false,
        })
          .then((service) => {
            if (service) {
              const business = req.user;
              if (service._business.equals(business._id)) {
                /**
                 * Delete here
                 */
                service._deleted = true;
                service.offerings.forEach((offer) => {
                  offer._deleted = true;
                });
                service.save()
                  .then(addedService => res.json({
                    message: Strings.serviceSuccess.serviceDeleted,
                  }))
                  .catch(e => next([e]));
              } else {
                next([Strings.offeringValidationError.invalidOperation]);
              }
            } else {
              /**
               * No service with the id in the request params
               */
              next([Strings.offeringValidationError.invalidService]);
            }
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 * Business delete offering
 */

router.post('/:id1/offering/:id2/delete', businessAuthMiddleware, (req, res, next) => {
  req.checkParams(validator.offeringEditValidationParmas);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        const serviceID = req.params.id1;
        const offeringID = req.params.id2;
        Service.findOne({
          _id: serviceID,
          _deleted: false,
        })
          .then((service) => {
            if (!service) {
              /**
               * No service with the id in the request params
               */
              next([Strings.offeringValidationError.invalidService]);
            } else {
              const business = req.user;
              if (service._business.equals(business._id)) {
                /**
                 * Delete here
                 */
                Offering.findOne({
                  _id: offeringID,
                })
                  .then((offering) => {
                    if (!offering) {
                      next([Strings.offeringValidationError.invalidServiceID]);
                    }
                    Offering.findOne({
                      _id: offeringID,
                    })
                      .then((offeringDoc) => {
                        offeringDoc._deleted = false;
                        offeringDoc.save((offeringDoc2) => {
                          let branchExist = false; // branch of this offering exit
                          service.offerings.forEach((offer) => {
                            if (!`${offer}` === offeringID && offer.branch === offering.branch) {
                              branchExist = true;
                            }
                            const newBranches = []; // new list of branches for the service
                            service.branches.forEach((branch) => {
                              if (branch.equals(offering.branch)) {
                                if (branchExist) {
                                  newBranches.push(branch);
                                }
                              } else {
                                newBranches.push(branch);
                              }
                            });
                            service.save()
                                .then((savedService) => {
                                  res.json({
                                    message: Strings.serviceSuccess.offeringDeleted,
                                  });
                                })
                                .catch(e => next(e));
                          });
                        })
                          .then()
                          .catch(e => next([e]));
                      })
                      .catch(e => next([e]));
                  })
                  .catch(e => next([e]));
              } else {
                next([Strings.offeringValidationError.invalidOperation]);
              }
            }
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

/**
 * Error handling middleware.
 */

router.use(errorHandler);

module.exports = router;
