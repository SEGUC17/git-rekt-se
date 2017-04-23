const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Admin = require('../../../../models/admin/Admin');
const AdminAuthenticator = require('../../../../services/admin/AdminAuthenticator');
const errorHandler = require('../../../../services/shared/errorHandler');
const jwtConfig = require('../../../../services/shared/jwtConfig');
const InvalidToken = require('../../../../models/shared/InvalidToken');
const Strings = require('../../../../services/shared/Strings');

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

if (process.env.DEBUG_MODE) {
  router.post('/create', (req, res) => {
    new Admin({
      email: 'mohamedelzarei@gmail.com',
      password: 'Strong#1234',
    })
      .save()
      .then(() => res.json({
        message: 'Dummy admin added.',
      }));
  });
}

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
 * Admin logout route.
 * http://stackoverflow.com/questions/3521290/logout-get-or-post
 */

router.post('/logout', jwtConfig.adminAuthMiddleware, (req, res, next) => {
  const token = jwtConfig.parseAuthHeader(req.headers.authorization)
    .value;
  new InvalidToken({
    token,
  })
    .save((err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: Strings.adminSuccess.logout,
      });
    });
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);


module.exports = router;
