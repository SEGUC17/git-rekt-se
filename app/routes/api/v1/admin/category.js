const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const Category = require('../../../../models/service/Category');
const path = require('path');

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
  console.log(req.file);
  const Servicecategory = new Category({
    type: req.body.type,
    title: req.body.title,
    icon: req.file.filename,
  });
  console.log(2);
  Servicecategory.save((err) => {
    if (err) {
      next(err);
    } else {
      res.json({
        message: 'Category added succesfully!',
      });
    }
  });
});

router.post('/editCategory/:id', upload.single('icon'), (req, res, next) => { // ensureauthenticated
  console.log(req.file);
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
      next(err);
    } else {
      console.log(category);
      res.json({
        message: 'Category edited succesfully!',
      });
    }
  });
  console.log(2);
});

router.post('/deleteCategory/:id', (req, res, next) => { // ensureauthenticated
  console.log(req.file);
  Category.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.json({
        message: 'Category deleted succesfully!',
      });
    }
    console.log(2);
  });
});

module.exports = router;
