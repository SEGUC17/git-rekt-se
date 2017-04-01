const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const Service = require('../../../../models/service/Service');

const router = express.Router();

/*
    Multer Config.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/uploads/service');
  },
  filename(req, file, cb) {
    const buf = crypto.randomBytes(16);
    const path = `${Date.now() + buf.toString('hex')}../../../../public/uploads/service${file.originalname}`;
    cb(null, path);
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
         /* match logged in business to service._businesss
          to check whether logged in business matches the service provider.*/
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
