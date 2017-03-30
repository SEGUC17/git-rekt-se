const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/validation');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Client signup route
 */

router.post('/signup', (req, res) => {
  req.checkBody(validationSchemas.clientSignupValidation);

  req.getValidationResult()
    .then((result) => {
      console.log(result.array());
    });

  res.send({
    message: 'ok',
  });
});

module.exports = router;
