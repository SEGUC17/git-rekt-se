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
const Business = require('../../../../models/business/Business');
const Branch = require('../../../../models/service/Branch');

const businessAuthMiddleware = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const validator = require('../../../../services/shared/validation');
const Strings = require('../../../../services/shared/Strings');

mongoose.Promise = Promise;

const router = express.Router();

/*
    Multer Config.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/dist/uploads');
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

router.get('/test', (req, res, next) => {
  console.log(1);
  const business1 = new Business({
    name: 'kojak',
    email: 'kojak@gmail.com',
    password: '12345678',
    _status: 'verified',
    shortDescription: 'zft',
  });

  business1.save()
    .then((newbusiness) => {
      const branch1 = new Branch({
        _business: newbusiness._id,
        location: 'Tagamo3',
      });
      branch1.save()
        .then((newbranch) => {
          business1.branches = [branch1._id];
          business1.save()
            .then(branch2 => res.json({
              message: 'database updated',
            }))
            .catch(e => next([e]));
        })
        .catch(e => next([e]));
    })
    .catch(e => next(e));
});


router.post('/create', businessAuthMiddleware, upload.single('coverImage'), (req, res, next) => {
  /**
   * Form validation
   */
  console.log('Hello world1');
  req.checkBody(validator.serviceCreateValidation);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        console.log('Hello world2');

        /**
         * Validation passed
         */
        const reqData = {
          name: req.body.name,
          shortDescription: req.body.shortDescription,
          description: req.body.description ? req.body.description : '',
          categories: req.body.categories ? req.body.categories : [],
        };
        console.log(req.file);

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
        console.log('Hello world3');


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
          console.log('zftnggjtngtkjtnm');
          service.save()
            .then(doc => res.json({
              message: Strings.serviceSuccess.serviceAdded,
            }))
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
          location: req.body.location,
          branch: req.body.branch,
          price: req.body.price,
          address: req.body.address ? req.body.address : '',
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
                  console.log(branch);
                  if (reqData.branch === `${branch}`) {
                    valid = true;
                  }
                });
                if (valid) {
                  const offering = new Offering({
                    startDate: reqData.startDate,
                    endDate: reqData.endDate,
                    location: reqData.location,
                    branch: reqData.branch,
                    price: reqData.price,
                    address: reqData.address,
                  });
                  offering.save()
                  .then((offer) => {
                    service.offerings.push(offer._id);
                    service.branches.push(offer.branch);
                    service.save()
                      .then(addedService => res.json({
                        message: Strings.serviceSuccess.offeringAdded,
                      }))
                      .catch(e => next([e]));
                  })
                  .catch(e => next([e]));
                } else {
                  return next([Strings.offeringValidationError.invalidBranch]);
                }
              } else {
              /**
               * business doesn't own this particular service to edit it
               */
                return next([Strings.offeringValidationError.invalidOperation]);
              }
            } else {
            /**
             * No service with the id in the request params
             */
              return next([Strings.offeringValidationError.invalidService]);
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
        reqData.categories.foreach((category) => {
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
                return next([Strings.offeringValidationError.invalidService]);
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
              }
              return next([Strings.offeringValidationError.invalidOperation]);
            })
            .catch(e => next([e]));
        }
        next([Strings.serviceValidationErrors.invalidCategory]);
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
            if (!service) {
              /**
               * No service with the id in the request params
               */
              return next([Strings.offeringValidationError.invalidService]);
            }

            if (service._business.equals(req.user._id)) {
              const business = req.user;
              if (business.branches.includes(reqData.branch)) {
                if (service.offerings.includes(offeringID)) {
                  // to test whether the offering only update or the array too
                  Offering.findOne({
                    _id: offeringID,
                    _deleted: false,
                  })
                    .then((offeringfound) => {
                      if (offeringfound) {
                        offeringfound.startDate = reqData.startDate;
                        offeringfound.endDate = reqData.endDate;
                        offeringfound.location = reqData.location;
                        offeringfound.branch = reqData.branch;
                        offeringfound.price = reqData.price;
                        offeringfound.address = reqData.address;
                        offeringfound.save()
                          .then((offer) => {
                            service.offerings.push(offer._id);
                            service.branches.push(offer.branch);
                            service.save()
                              .then(addedService => res.json({
                                message: Strings.serviceSuccess.offeringEdited,
                              }))
                              .catch(e => next([e]));
                          })
                          .catch(e => next([e]));
                        return;
                      }
                      next([Strings.offeringValidationError.invalidOffering]);
                    })
                    .catch(e => next([e]));
                } else {
                  return next([Strings.offeringValidationError.invalidOffering]);
                }
              } else {
                return next([Strings.offeringValidationError.invalidBranch]);
              }
            }

            /**
             * business doesn't own this particular service to edit it
             */
            return next([Strings.offeringValidationError.invalidOperation]);
          })
          .catch(e => next([e]));
      } else {
        next(result.array());
      }
    })
    .catch(e => next([e]));
});

// /**
//  * Business delete service
//  */

// router.get('/:id/delete', businessAuthMiddleware, (req, res, next) => {
//   req.checkParams(validator.ServiceCreateValidationParams);
//   req.getValidationResult().then((result) => {
//     if (result.isEmpty()) {
//       const serviceID = req.params.id;
//       Service.findOne({
//         _id: serviceID,
//         _deleted: false,
//       }).then((service) => {
//         if (!service) {
//           /**
//            * No service with the id in the request params
//            */
//           return next([Strings.offeringValidationError.invalidService]);
//         }
//         const business = req.user;
//         if (service._business.equals(business._id)) {
//           /**
//            * Delete here
//            */
//           service._deleted = false;
//         } else {
//           return next([Strings.offeringValidationError.invalidOperation]);
//         }
//       }).catch(e => next([e]));
//     } else {
//       return next(result.array());
//     }
//   }).catch(e => next([e]));
// });

// /**
//  * Business delete offering
//  */

// router.get('/:id1/offering/:id2/delete', businessAuthMiddleware, (req, res, next) => {
//   req.checkParams(validator.ServiceCreateValidationParams);
//   req.getValidationResult().then((result) => {
//     if (result.isEmpty()) {
//       const serviceID = req.params.id1;
//       const offeringID = req.params.id2;
//       Service.findOne({
//         _id: serviceID,
//         _deleted: false,
//       }).then((service) => {
//         if (!service) {
//           /**
//            * No service with the id in the request params
//            */
//           return next([Strings.offeringValidationError.invalidService]);
//         }
//         const business = req.user;
//         if (service._business.equals(business._id)) {
//           /**
//            * Delete here
//            */
//           Offering.findOne({
//             _id: offeringID,
//           }).then((offering) => {
//             if (!offering) {
//               return next([Strings.offeringValidationError.invalidServiceID]);
//             }
//             service._deleted = false;
//           }).catch(e => next([e]));
//         } else {
//           return next([Strings.offeringValidationError.invalidOperation]);
//         }
//       }).catch(e => next([e]));
//     } else {
//       return next(result.array());
//     }
//   }).catch(e => next([e]));
// });

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
