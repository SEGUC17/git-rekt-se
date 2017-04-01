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
    const path = Date.now() + buf.toString('hex') + '../../../../public/uploads/service' + file.originalname;
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
/* match logged in business to service._businesss
 to check whether logged in business matches the service provider.*/
  Service.findOne({
    _id: req.params.id,
  })
    .exec((err, service) => {
      if (service) {
        service.gallery.push(image);
        Service.save((err2) => {
          if (err) {
            return next(err);
          }
          if (err2) {
            return next(err2);
          }
          return res.json({
            message: 'Image added succesfully!',
          });
        });
      }
    });
});
