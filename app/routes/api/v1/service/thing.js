const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');
const path = require('path');

const router = express.Router();
/* eslint-disable no-underscore-dangle */

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
router.use(bodyParser.json());
router.post('/addServiceImage/:id', upload.single('file'), (req, res, next) => { // ensureauthenticated
  Service.findOne({
    _id: req.params.id,
  })
    .exec((err, service) => {
      if (service) {
        const image = ({
          path: req.file.filename,
          description: req.body.description,
        });
         // match logged in business to service._businesss
         // to check whether logged in business matches the service provider.
         // if (Service._business === req.user._id) {
        service.gallery.push(image);
        service.save((err2) => {
          if (err) {
            next(err);
          } else
          if (err2) {
            next(err2);
          } else {
            res.json({
              message: Strings.serviceSuccess.imageAdd,
            });
          }
        });
      } else {
        res.json({
          message: Strings.serviceFail.invalidService,
        });
        next(err);
      }
    });
});


/*
Service Image Update
*/
router.post('/editServiceImage/:ser_id/:im_id', (req, res, next) => { // ensureauthenticated
  Service.findOne({
    _id: req.params.ser_id,
  })
    .exec((err, service) => {
      console.log('-----------------service(findone)------------------');
      console.log(service);
      console.log(req.params.im_id);
      if (service) {
        const image = service.gallery.find(element => `${element._id}` === req.params.im_id);
        if (!image) {
          console.log('_____________no image returned_______');
          next(err);
        } else {
          const newDescr = req.body.description;
          console.log('----------------------desc---------------------------');
          console.log(newDescr);
          console.log('image?');
          console.log(image);
          image.description = newDescr;
          service.save((err3) => {
            if (err3) {
              next(err3);
            } else {
              res.json({
                message: Strings.serviceSuccess.imageEdit,
              });
            }
          });
        }
      } else {
        res.json({
          message: Strings.serviceFail.invalidService,
        });
        next(err);
      }
    });
});

/*
Service Image Update
*/
router.post('/deleteServiceImage/:ser_id/:im_id', (req, res, next) => { // ensureauthenticated
  Service.findOne({
    _id: req.params.ser_id,
  })
    .exec((err, service) => {
      console.log('-----------------service(findone)------------------');
      console.log(service);
      if (service) {
        const newGallery = service.gallery.filter(element => `${element._id}` !== req.params.im_id);
        if (!newGallery) {
          console.log('_____________no image returned_______');
          next(err);
        } else {
          service.gallery = newGallery;
          service.save((err3) => {
            if (err3) {
              next(err3);
            } else {
              console.log(service);
              res.json({
                message: Strings.serviceSuccess.imageDelete,
              });
            }
          });
        }
      } else {
        res.json({
          message: Strings.serviceFail.invalidService,
        });
        next(err);
      }
    });
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
