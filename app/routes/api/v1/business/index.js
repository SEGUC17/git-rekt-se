const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const Service = require('../../../../models/service/Service');
const Category = require('../../../../models/service/Category');
const Offering = require('../../../../models/service/Offering');
const Branch = require('../../../../models/service/Branch');

const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const validator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const createServiceUtils = require('../../../../services/business/createServiceUtils');

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
        createServiceUtils.checkCategories(reqData.categories).then((categories) => {
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
            next([Strings.serviceValidationErrors.invalidCategory]);
          }
        }).catch(e => next([e]));
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
        let valid = true;
        reqData.categories.forEach((category) => {
          Category.findOne({
            _id: category,
            _deleted: false,
            type: 'Service',
          })
            .then((data) => {
              if (!data) {
                valid = false;
              }
            })
            .catch(e => next([e]));
        });
        if (valid) {
          Service.findOne({
            _id: req.params.id,
            _deleted: false,
          })
            .then((service) => {
              if (!service) {
                next([Strings.offeringValidationError.invalidService]);
              }
              if (service._business.equals(req.user._id)) {
                service.name = reqData.name;
                service.shortDescription = reqData.shortDescription;
                service.description = reqData.description;
                service.categories = reqData.categories;
                service._business = req.user._id;
                service.coverImage = req.file ? req.filename : undefined;
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
          next([Strings.serviceValidationErrors.invalidCategory]);
        }
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
        const reqData = {
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          location: req.body.location,
          branch: req.body.branch,
          price: req.body.price,
          address: req.body.address ? req.body.address : '',
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
                  service.offerings.forEach((args) => {
                    Offering.findOne({
                      _id: args,
                    })
                      .then((serviceOffering) => {
                        if (`${serviceOffering}` === offeringID) {
                          validOffering = true;
                        }
                      })
                      .catch(e => next([e]));
                  });
                  if (validOffering) {
                    Offering.findOne({
                      _id: offeringID,
                      _deleted: false,
                    })
                      .then((offeringfound) => {
                        if (offeringfound) {
                          const oldbranch = offeringfound.branch;
                          offeringfound.startDate = reqData.startDate;
                          offeringfound.endDate = reqData.endDate;
                          offeringfound.location = reqData.location;
                          offeringfound.branch = reqData.branch;
                          offeringfound.price = reqData.price;
                          offeringfound.address = reqData.address;
                          offeringfound.save()
                            .then((offer) => {
                              let oldexist = false; // old branch before edit exist
                              let newexist = false; // new branch after edit exit

                              service.offerings.forEach((args) => {
                                Offering.findOne({
                                  _id: args,
                                })
                                  .then((offering) => {
                                    if (offering.branch === oldbranch && offeringID !== `${offering._id}`) {
                                      oldexist = true;
                                    } else if (`${offering.branch}` === reqData.branch && offeringID !== `${offering._id}`) {
                                      newexist = true;
                                    }
                                  })
                                  .catch(e => next([e]));
                              });
                              const newBranches = []; // new list of branches for the service
                              service.branches.forEach((branch) => {
                                if (branch.equals(oldbranch)) {
                                  if (oldexist) {
                                    newBranches.push(branch);
                                  }
                                } else if (`${branch}` === reqData.branch) {
                                  if (!newexist) {
                                    newBranches.push(branch);
                                  }
                                } else {
                                  newBranches.push(branch);
                                }
                              });
                              service.branches = newBranches;
                              service.save()
                                .then(addedService => res.json({
                                  message: Strings.serviceSuccess.offeringEdited,
                                }))
                                .catch(e => next([e]));
                            })
                            .catch(e => next([e]));
                        } else {
                          next([Strings.offeringValidationError.invalidOffering]);
                        }
                      })
                      .catch(e => next([e]));
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
                    let branchExist = false; // branch of this offering e
                    service.offerings.forEach((offer) => {
                      if (`${offer}` === offeringID) {
                        Offering.findOne({
                          _id: offer,
                        })
                          .then((offerObject) => {
                            offerObject._deleted = true;
                            offerObject.save();
                          })
                          .catch(e => next([e]));
                      } else if (offer.branch === offering.branch) {
                        branchExist = true;
                      }
                    });
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
 * Error handling Middlewares
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});


module.exports = router;
