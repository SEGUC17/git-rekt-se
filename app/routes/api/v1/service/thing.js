const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const Service = require('../../../../models/service/Service');
const path = require('path');

const router = express.Router();

/*
    Multer Config.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/home/abdelrahman-a-elshabrawy/Desktop/W/Sem 6/CSEN603 SE/Term Project/git-rekt-se/app/public');
  },
  filename(req, file, cb) {
    const buf = crypto.randomBytes(16);
    cb(null, 'abc.png');
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
/* UNCOMMENT WHEN AUTHENTICATION IS READY
router.post('/addServiceImage/:id', upload.any(), (req, res, next) => { // ensureauthenticated
  const image = ({
    path: req.files[0],
    description: req.body.description,
  });
  Service.findOne({
    _id: req.params.id,
  })
    .exec((err, service) => {
      if (service) {
         // match logged in business to service._businesss
         // to check whether logged in business matches the service provider.
        if (Service._business === req.user._id) {
          service.gallery.push(image);
          Service.save((err2) => {
            if (err) {
              next(err);
            } else
            if (err2) {
              next(err2);
            } else {
              res.json({
                message: 'Image added succesfully!',
              });
            }
          });
        } else {
          res.json({
            message: 'This service does not belong to your business!',
          });
        }
      } else {
        res.json({
          message: 'Invalid service!',
        });
        next(err);
      }
    });
});
*/
router.post('/addServiceImage/:id', upload.single('file'), (req, res, next) => { // ensureauthenticated
  const image = ({
    path: req.file.filename,
    description: req.body.description,
  });
  Service.findOne({
    _id: req.params.id,
  })
    .exec((err, service) => {
      console.log('-----------------service(findone)------------------');
      console.log(service);
      if (service) {
        service.gallery.push(image);
        service.save((err2) => {
          if (err) {
            next(err);
          } else
          if (err2) {
            next(err2);
          } else {
            res.json({
              message: 'Image added succesfully!',
            });
          }
        });
      } else {
        res.json({
          message: 'Invalid service!',
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
