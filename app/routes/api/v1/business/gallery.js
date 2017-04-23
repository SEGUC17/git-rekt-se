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
    cb(null, path.join(__dirname, '../../../../../public/dist/uploads'));
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
 * view Business gallery Images.
 */

router.get('/list', BusinessAuth, (req, res, next) => {
  Business.findOne({
    _id: req.user._id,
    _deleted: false,
  })
    .exec()
    .then((business) => {
      if (business) {
        res.json({
          results: business.gallery,
        });
      } else {
        next(Strings.businessMessages.businessDoesntExist);
      }
    })
    .catch(err => next(err));
});

/**
 * Add Image To Service Gallery API Route.
 */

router.post('/add', BusinessAuth, upload.single('path'), (req, res, next) => {
  Business.findOne({
    _id: req.user._id,
    _deleted: false,
  })
    .exec()
    .then((business) => {
      if (business) {
        if (req.file) {
          if (req.file.mimetype.split('/')[0] === 'image') {
            const image = ({
              path: req.file.filename,
              description: req.body.description,
            });
            business.gallery.push(image);
            business.save()
              .then(() => {
                res.json({
                  message: Strings.serviceSuccess.imageAdd,
                });
              })
              .catch(saveErr => next(saveErr));
          } else {
            next(Strings.businessMessages.invalidFile);
          }
        } else {
          next(Strings.businessMessages.imageNotFound);
        }
      } else {
        next(['The required id is invalid.']);
      }
    })
    .catch(err => next(err));
});


/**
 * Edit Image In Business Gallery API Route.
 */

router.post('/edit/:im_id', BusinessAuth, (req, res, next) => {
  console.log(11);
  req.checkParams(validationSchemas.businessEditImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Business.findOne({
          _id: req.user._id,
          _deleted: false,
        })
          .exec()
          .then((business) => {
            console.log(22);
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
                      message: Strings.serviceSuccess.imageEdit,
                    });
                  })
                  .catch(saveErr => next(saveErr));
              }
            } else {
              next(['The required id is invalid.']);
            }
          })
          .catch(err => next(err));
      } else {
        next(['The required id is invalid.']);
      }
    })
    .catch(err => next(err));
});

/**
 * Delete Image In Business Gallery API Route.
 */

router.post('/delete/:im_id', BusinessAuth, (req, res, next) => {
  req.checkParams(validationSchemas.businessEditImageValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        Business.findOne({
          _id: req.user._id,
          _deleted: false,
        })
          .exec()
          .then((business) => {
            if (business) {
              const image = business.gallery
                .find(element => `${element._id}` === `${req.params.im_id}`);
              if (!image) {
                next(Strings.businessMessages.invalidImage);
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
              next([Strings.businessMessages.invalidID]);
            }
          })
          .catch(err => next(err));
      } else {
        next(result.array());
      }
    })
    .catch(err => next(err));
});


/**
 * Error handling middleware.
 */

router.use(errorHandler);

module.exports = router;
