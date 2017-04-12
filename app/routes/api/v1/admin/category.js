const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Category = require('../../../../models/service/Category');
const AdminAuth = require('../../../../services/shared/jwtConfig')
  .adminAuthMiddleware;
const Strings = require('../../../../services/shared/Strings.js');
const errorHandler = require('../../../../services/shared/errorHandler');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const router = express.Router();

/**
 * Express Validator.
 */

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

router.use(bodyParser.json());

router.post('/add', AdminAuth, upload.single('icon'), (req, res, next) => {
  req.checkBody(validationSchemas.adminCategoryValidation);
  req.getValidationResult()
    .then((results) => {
      if (results.isEmpty()) {
        const icon = req.file ? req.file.filename : '';
        const category = new Category({
          type: req.body.type,
          title: req.body.title,
          icon,
        });
        category.save((err) => {
          if (err) {
            next(err);
            return;
          }
          res.json({
            message: Strings.adminSuccess.categoryAdded,
          });
        });
      } else {
        next(results.array());
      }
    });
});

router.post('/edit/:id', AdminAuth, upload.single('icon'), (req, res, next) => {
  req.checkBody(validationSchemas.adminCategoryValidation);
  req.getValidationResult()
    .then((results) => {
      const icon = req.file ? req.file.filename : '';
      if (results.isEmpty()) {
        const category = new Category({
          type: req.body.type,
          title: req.body.title,
          icon,
        });
        Category.findOne({
          _id: req.params.id,
        }, (err, category2) => {
          if (err) {
            next(err);
            return;
          }
          category2.type = category.type;
          category2.title = category.title;
          category2.icon = category.icon;
          category2.save((err2) => {
            if (err2) {
              return next(err2);
            }
            return res.json({
              message: Strings.adminSuccess.categoryEdited,
            });
          });
        });
      } else {
        next(results.array());
      }
    });
});

router.post('/delete/:id', AdminAuth, (req, res, next) => {
  Category.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    return res.json({
      message: Strings.adminSuccess.categoryDeleted,
    });
  });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
