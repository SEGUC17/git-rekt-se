const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Admin = require('../../../../models/admin/Admin');
const AdminAuthenticator = require('../../../../services/admin/AdminAuthenticator');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Dummy admin registeration route
 * FOR TESTING PURPOSES
 */

router.post('/create', (req, res) => {
  new Admin({
    email: 'mohamedelzarei@gmail.com',
    password: 'helloworld',
  })
    .save()
    .then(() => res.json({
      message: 'Dummy admin added.',
    }));
});

/*
  * Admin Login
  */
router.post('/login', (req, res, next) => {
  req.checkBody(validationSchemas.administratorLoginValidation);
  req.getValidationResult()
     .then((result) => {
       if (result.isEmpty()) {
         AdminAuthenticator.loginAdmin(req.body.email, req.body.password)
           .then(info => res.json(info))
           .catch(err => next([err]));
       } else {
         next(result.array());
       }
     });
});

/**
 * Admin login route
 */

router.post('/login', (req, res) => {
  res.send({
    message: 'This should be fun.',
  });
});

module.exports = router;
