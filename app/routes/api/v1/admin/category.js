const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const Category = require('../../../../models/service/Category');
const path = require('path');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const router = express.Router();
/* eslint-disable no-underscore-dangle */

/*
    Multer Config.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/home/youssef/git-rekt-se/app/public');
  },
  filename(req, file, cb) {
    const buf = crypto.randomBytes(16);
    cb(null, 'abc.jpg');
  },
});

const upload = multer({
  storage,
});

router.use(bodyParser.json());


router.post('/addCategory', upload.single('icon'), (req, res, next) => { // ensureauthenticated
  // console.log(req.file);
  const Servicecategory = new Category({
    type: req.body.type,
    title: req.body.title,
    icon: req.file.filename,
  });
  // console.log(2);
  Servicecategory.save((err) => {
    if (err) {
      return next(err);
    }
    return res.json({
      message: 'Category added succesfully!',
    });
  });
});

// router.post('/addCategory', upload.single('icon'), (req, res, next) => { // ensureauthenticated
//   // console.log(req.file);
//   const Servicecategory = new Category({
//     type: req.body.type,
//     title: req.body.title,
//     icon: req.file.filename,
//   });
//   const promise = Servicecategory.save();
//   promise.then(Servicecategory.save())
//     .then(res.json({
//       message: 'Category added succesfully!',
//     }))
//     .catch((err) => {
//       next(err);
//     });
// });

router.post('/editCategory/:id', upload.single('icon'), (req, res, next) => { // ensureauthenticated
  //  console.log(req.file);
  if (req.body.type && req.body.title && req.file.filename) {
    if (req.body.type === 'Business' || req.body.type === 'Service') {
      // console.log(req.body.type);
      Category.findByIdAndUpdate(req.params.id, {
        $set: {
          type: req.body.type,
          title: req.body.title,
          icon: req.file.filename,
        },
      }, {
        new: true,
      }, (err, category) => {
        if (err) {
          console.log(1);
          return next(err);
        }
        // console.log(category);
        console.log(2);
        return res.json({
          message: 'Category edited succesfully!',
        });
      });
      // }
    } else {
      return next('Invalid values');
    }
  } else {
    return next('Missing values');
  }
  return next('error');
});

router.post('/deleteCategory/:id', (req, res, next) => { // ensureauthenticated
  //  console.log(req.file);
  Category.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    return res.json({
      message: 'Category deleted succesfully!',
    });
    //  console.log(2);
  });
});

/**
 *  Error Handling Middlewares.
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});
module.exports = router;
