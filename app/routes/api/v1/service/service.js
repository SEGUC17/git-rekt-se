const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const Service = require('../../../../models/service/Service');
const validationSchemas = require('../../../../services/shared/validation');
const BusinessAuth = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const Strings = require('../../../../services/shared/Strings');
const path = require('path');
const expressValidator = require('express-validator');

const router = express.Router();
/* eslint-disable no-underscore-dangle */

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/*
    Multer Config.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/home/abdelrahman-a-elshabrawy/Desktop/W/Sem 6/CSEN603 SE/Term Project/git-rekt-se/app/public');
  },
  filename(req, file, cb) {
    const buf = crypto.randomBytes(48);
    cb(null, Date.now() + buf.toString('hex') + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

/*
Service Image CRUD section
*/

/*
Service Image Create
*/
router.post('/addServiceImage/:id', BusinessAuth, upload.single('path'), (req, res, next) => { // ensureauthenticated
  req.checkParams(validationSchemas.serviceAddImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Service.findOne({
          _id: req.params.id,
        })
          .exec()
          .then((service) => {
            if (service) {
              /* check whether logged in business matches the service provider.*/
              if (`${service._business}` === `${req.user._id}`) {
                const image = ({
                  path: req.file.filename,
                  description: req.body.description,
                });
                service.gallery.push(image);
                service.save()
                  .then(() => {
                    res.json({
                      message: Strings.serviceSuccess.imageAdd,
                    });
                  })
                  .catch(saveErr => next([saveErr]));
              } else {
                next([Strings.serviceFailure.notYourService]);
              }
            } else {
              next([Strings.serviceFailure.invalidService]);
            }
          })
          .catch(err => next([err]));
      } else {
        next(Strings.serviceValidationErrors.invalidServiceID);
      }
    })
    .catch(err => next([err]));
});


/*
Service Image Update
*/
router.post('/editServiceImage/:ser_id/:im_id', BusinessAuth, (req, res, next) => { // ensureauthenticated
  req.checkParams(validationSchemas.serviceEditImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Service.findOne({
          _id: req.params.ser_id,
        })
          .exec()
          .then((service) => {
            if (service) {
              if (`${service._business}` === `${req.user._id}`) {
                const image = service.gallery
                  .find(element => `${element._id}` === `${req.params.im_id}`);
                if (!image) {
                  next([Strings.serviceFailure.imageNotFound]);
                } else {
                  const newDescr = req.body.description;
                  image.description = newDescr;
                  service.save()
                    .then(() => {
                      res.json({
                        message: Strings.serviceSuccess.imageEdit,
                      });
                    })
                    .catch(saveErr => next([saveErr]));
                }
              } else {
                next([Strings.serviceFailure.notYourService]);
              }
            } else {
              next([Strings.serviceFailure.invalidService]);
            }
          })
          .catch(err => next([err]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next([err]));
});

/*
Service Image Update
*/
router.post('/deleteServiceImage/:ser_id/:im_id', BusinessAuth, (req, res, next) => { // ensureauthenticated
  req.checkParams(validationSchemas.serviceEditImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Service.findOne({
          _id: req.params.ser_id,
        })
          .exec()
          .then((service) => {
            if (service) {
              if (`${service._business}` === `${req.user._id}`) {
                const image = service.gallery
                  .find(element => `${element._id}` === `${req.params.im_id}`);
                if (!image) {
                  next([Strings.serviceFailure.imageNotFound]);
                } else {
                  const newGallery = service.gallery
                    .filter(element => `${element._id}` !== `${req.params.im_id}`);
                  service.gallery = newGallery;
                  service.save()
                    .then(() => {
                      res.json({
                        message: Strings.serviceSuccess.imageDelete,
                      });
                    })
                    .catch(saveErr => next([saveErr]));
                }
              } else {
                next([Strings.serviceFailure.notYourService]);
              }
            } else {
              next([Strings.serviceFailure.invalidService]);
            }
          })
          .catch(err => next([err]));
      } else {
        next(result.array());
      }
    })
    .catch(err => next([err]));
});

/*
Error handling middleware
*/
router.use((err, req, res, next) => {
  res.status(400)
    .json({
      error: err.toString(),
    });
});


module.exports = router;
