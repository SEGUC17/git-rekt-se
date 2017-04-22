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
const Category = require('../../../../models/service/Category');

const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const validator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');
const createServiceUtils = require('../../../../services/business/createServiceUtils');
const errorHandler = require('../../../../services/shared/errorHandler');

mongoose.Promise = Promise;

const router = express.Router();

/**
 * Multer Config.
 */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../../../../public/dist/uploads'));
  },
  filename(req, file, cb) {
    const buf = crypto.randomBytes(48);
    cb(null, Date.now() + buf.toString('hex') + path.extname(file.originalname));
  },
  fileFilter: ((req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    return cb(null, true);
  }),
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
 * List all service categories
 */

router.get('/category/list', businessAuthMiddleware, (req, res, next) => {
  Category.find({
    type: 'Service',
    _deleted: false,
  })
  .exec()
  .then((categories) => {
    const categoryDropDown = categories.map(category => ({
      label: category.title,
      value: category._id,
    }));
    res.json({
      categories: categoryDropDown,
    });
  })
  .catch(e => next(e));
});


/**
 * List all services belonging to a business
 */

router.get('/list', businessAuthMiddleware, (req, res, next) => {
  Service.find({
    _business: req.user.id,
    _deleted: false,
  })
  .exec()
  .then((services) => {
    res.json({
      services,
    });
  })
  .catch(e => next(e));
});

/**
 * List all branches belonging to a business
 */

router.get('/branch/list', businessAuthMiddleware, (req, res, next) => {
  Branch.find({
    _business: req.user.id,
    _deleted: false,
  })
  .exec()
  .then((branches) => {
    const branchDropDown = branches.map(branch => ({
      label: `${branch.address} - ${branch.location}`,
      value: branch._id,
    }));
    res.json({
      branches: branchDropDown,
    });
  })
  .catch(e => next(e));
});

/**
 * List offerings belonging to a service
 */

router.get('/:id/offering/list', businessAuthMiddleware, (req, res, next) => {
  Service.findOne({
    _id: req.params.id,
    _deleted: false,
  })
  .exec()
  .then((service) => {
    if (!service) {
      next(Strings.offeringValidationError.invalidService);
      return;
    }
    if (`${service._business}` !== `${req.user.id}`) {
      next(Strings.offeringValidationError.invalidOperation);
      return;
    }
    const validOfferings = service.offerings.filter(offering => !offering._deleted);
    res.json({
      offerings: validOfferings,
    });
  })
  .catch(e => next(e));
});

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
                .then(() => res.json({
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
          capacity: req.body.capacity,
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
                  if (reqData.branch === `${branch}` && !branch._deleted) {
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
                        capacity: reqData.capacity,
                      });
                      service.offerings.push(offering);
                      service.branches.addToSet(offering.branch);

                      service.save()
                        .then(() => {
                          res.json({
                            message: Strings.serviceSuccess.offeringAdded,

                          });
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
                      .then(() => {
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
              capacity: req.body.capacity,
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
                      if (reqData.branch === `${branch}` && !branch._deleted) {
                        validBranch = true;
                      }
                    });
                    if (validBranch) {
                      let validOffering = false;
                      let offeringDoc;
                      service.offerings.forEach((offering) => {
                        if (`${offering._id}` === offeringID && !offering._deleted) {
                          offering.startDate = reqData.startDate;
                          offering.endDate = reqData.endDate;
                          offering.location = reqData.location;
                          offering.branch = reqData.branch;
                          offering.price = reqData.price;
                          offering.address = reqData.address;
                          offering.capacity = reqData.capacity;
                          validOffering = true;
                          offeringDoc = offering;
                        }
                      });
                      if (validOffering) {
                        const oldbranch = offeringDoc.branch;

                        let oldexist = false; // old branch before edit exist

                        service.offerings.forEach((offering) => {
                          if (offering.branch === oldbranch && offeringID !== `${offering._id}` && !offering._deleted) {
                            oldexist = true;
                          }
                        });

                        if (!oldexist) {
                          service.branches.pull(oldbranch);
                        }
                        service.branches.addToSet(offeringDoc.branch);
                        service.markModified('offerings');
                        service.save()
                          .then(() => res.json({
                            message: Strings.serviceSuccess.offeringEdited,
                          }))
                          .catch((e) => {
                            next([e]);
                          });
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
                  .then(() => res.json({
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

                let validOffering = false;
                let offeringDoc;
                service.offerings.forEach((offering) => {
                  if (`${offering._id}` === offeringID && !offering._deleted) {
                    offering._deleted = true;
                    validOffering = true;
                    offeringDoc = offering;
                  }
                });

                if (!validOffering) {
                  next([Strings.offeringValidationError.invalidOffering]);
                  return;
                }
                let branchExist = false; // branch of this offering
                const oldbranch = offeringDoc.branch;
                service.offerings.forEach((offer) => {
                  if (!`${offer}` === offeringID && offer.branch === oldbranch && !offer._deleted) {
                    branchExist = true;
                  }
                  if (!branchExist) {
                    service.branches.pull(oldbranch);
                  }
                });
                service.markModified('offerings');
                service.save()
                  .then(() => {
                    res.json({
                      message: Strings.serviceSuccess.offeringDeleted,
                    });
                  })
                  .catch(e => next(e));
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
