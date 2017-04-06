const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const validationSchemas = require('../../../../services/shared/validation');
const BusinessAuth = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const Strings = require('../../../../services/shared/Strings');
const path = require('path');
const expressValidator = require('express-validator');
const Business = require('../../../../models/business/Business');
const errorHandler = require('../../../../services/shared/errorHandler');


const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Multer Config.
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

/**
 * Add Image to service gallery.
 */

router.post('/:id/gallery/add', BusinessAuth, upload.single('path'), (req, res, next) => {
  req.checkParams(validationSchemas.businessAddImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Business.findOne({
          _id: req.params.id,
        })
          .exec()
          .then((business) => {
            if (business) {
              const image = ({
                path: req.file.filename,
                description: req.body.description,
              });
              business.gallery.push(image);
              business.save()
                .then(() => {
                  res.json({
                    message: 'Image added successfully!',
                  });
                })
                .catch(saveErr => next(saveErr));
            } else {
              next(['The required id is invalid.']);
            }
          })
          .catch(err => next(err));
      } else {
        next('The required id is invalid.');
      }
    })
    .catch(err => next(err));
});


/**
 * Edit Image in Business gallery.
 */

router.post('/:ser_id/gallery/edit/:im_id', BusinessAuth, (req, res, next) => {
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
              const image = business.gallery
                .find(element => `${element._id}` === `${req.params.im_id}`);
              if (!image) {
                next([Strings.serviceFail.imageNotFound]);
              } else {
                const newDescr = req.body.description;
                image.description = newDescr;
                business.save()
                  .then(() => {
                    res.json({
                      message: 'Image edited successfully',
                    });
                  })
                  .catch(saveErr => next(saveErr));
              }
            } else {
              next('The required id is invalid.');
            }
          })
          .catch(err => next(err));
      } else {
        next('The required id is invalid.');
      }
    })
    .catch(err => next(err));
});

/**
 * Delete Image in Business gallery.
 */

router.post('/:ser_id/gallery/delete/:im_id', BusinessAuth, (req, res, next) => {
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
              const image = business.gallery
                .find(element => `${element._id}` === `${req.params.im_id}`);
              if (!image) {
                next(Strings.businessMessages.invalidIamge);
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
                  .catch(saveErr => next(saveErr));
              }
            } else {
              next(Strings.businessMessages.invalidID);
            }
          })
          .catch(err => next(err));
      } else {
        next(Strings.businessMessages.invalidID);
      }
    })
    .catch(err => next(err));
});


/**
 * Error handling middleware.
 */

router.use(errorHandler);

module.exports = router;
