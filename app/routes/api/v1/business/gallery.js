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
const Business = require('../../../../models/business/Business');

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
    cb(null, path.join(__dirname, '../../../../public/uploads'));
  },
  filename(req, file, cb) {
    const buf = crypto.randomBytes(16);
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

router.post('/addBusinessImage/:id', BusinessAuth, upload.single('path'), (req, res, next) => { // ensureauthenticated
  console.log('entering post...');
  req.checkParams(validationSchemas.businessAddImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        console.log('result empty');
        Business.findOne({
          _id: req.params.id,
        })
          .exec()
          .then((business) => {
            if (business) {
              /* check whether logged in business matches the service provider.*/
              console.log(4);
              // if (`${business._id}` === `${req.user._id}`) {
              const image = ({
                path: req.file.filename,
                description: req.body.description,
              });
              console.log(5);
              business.gallery.push(image);
              console.log(6);
              business.save()
                .then(() => {
                  console.log(7);
                  res.json({
                    message: Strings.serviceSuccess.imageAdd,
                  });
                })
                .catch(saveErr => next([saveErr]));
              //   } else {
              //     next([Strings.serviceFail.notYourService]);
              //   }
            } else {
              next([Strings.serviceFail.invalidService]);
            }
          })
          .catch(err => next(err));
      } else {
        next(Strings.serviceValidationErrors.invalidServiceID);
      }
    })
    .catch(err => next('err'));
});


/*
Service Image Update
*/
router.post('/editBusinessImage/:ser_id/:im_id', BusinessAuth, (req, res, next) => { // ensureauthenticated
  req.checkParams(validationSchemas.businessEditImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Business.findOne({
          _id: req.params.ser_id,
        })
          .exec()
          .then((business) => {
            if (business) {
              console.log(1);
              //   if (`${business.id}` === `${req.ser._id}`) {
              const image = business.gallery
                .find(element => `${element._id}` === `${req.params.im_id}`);
              if (!image) {
                next([Strings.serviceFail.imageNotFound]);
              } else {
                console.log(2);
                const newDescr = req.body.description;
                image.description = newDescr;
                business.save()
                  .then(() => {
                    console.log(3);
                    res.json({
                      message: Strings.serviceSuccess.imageEdit,
                    });
                  })
                  .catch(saveErr => next([saveErr]));
              }
              //   } else {
              //     next([Strings.serviceFail.notYourService]);
              //   }
            } else {
              next([Strings.serviceFail.invalidService]);
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
router.post('/deleteBusinessImage/:ser_id/:im_id', BusinessAuth, (req, res, next) => { // ensureauthenticated
  req.checkParams(validationSchemas.businessEditImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Business.findOne({
          _id: req.params.ser_id,
        })
          .exec()
          .then((business) => {
            if (business) {
              if (`${business._business}` === `${req.user._id}`) {
                const image = business.gallery
                  .find(element => `${element._id}` === `${req.params.im_id}`);
                if (!image) {
                  next([Strings.serviceFail.imageNotFound]);
                } else {
                  const newGallery = business.gallery
                    .filter(element => `${element._id}` !== `${req.params.im_id}`);
                  business.gallery = newGallery;
                  business.save()
                    .then(() => {
                      res.json({
                        message: Strings.serviceSuccess.imageDelete,
                      });
                    })
                    .catch(saveErr => next([saveErr]));
                }
              } else {
                next([Strings.serviceFail.notYourService]);
              }
            } else {
              next([Strings.serviceFail.invalidService]);
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
