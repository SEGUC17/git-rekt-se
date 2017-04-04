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

router.post('/editCategory/:id', upload.single('icon'), (req, res, next) => { // ensureauthenticated
  const Servicecategory = new Category({
    type: req.body.type,
    title: req.body.title,
    icon: req.file.filename,
  });
  Category.findOne({
    _id: req.params.id,
  }, (err, category2) => {
    if (err) {
      next(err);
      return;
    }
    //  console.log(category2);
    category2.type = Servicecategory.type;
    category2.title = Servicecategory.title;
    category2.icon = Servicecategory.icon;
    //  console.log(category2);
    category2.save((err2) => {
      if (err2) {
        return next(err2);
      }
      return res.json({
        message: 'Category edited succesfully!',
      });
    });
  });
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
