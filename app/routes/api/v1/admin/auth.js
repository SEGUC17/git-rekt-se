const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Admin = require('../../../../models/admin/Admin');
const AdminAuthenticator = require('../../../../services/admin/AdminAuthenticator');
const errorHandler = require('../../../../services/shared/errorHandler');

const router = express.Router();

/**
 * Parsing Middleware(s).
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Dummy admin registeration route.
 * FOR TESTING PURPOSES.
 */

router.post('/create', (req, res) => {
  new Admin({
    email: 'mohamedelzarei@gmail.com',
    password: 'helloworld#1234',
  })
    .save()
    .then(() => res.json({
      message: 'Dummy admin added.',
    }));
});

/*
 * Admin Login route.
 */

router.post('/login', (req, res, next) => {
  req.checkBody(validationSchemas.adminLoginValidation);
  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        AdminAuthenticator.loginAdmin(req.body.email, req.body.password)
          .then(info => res.json(info))
          .catch(err => next(err));
      } else {
        next(result.array());
      }
    });
});


/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);


module.exports = router;
