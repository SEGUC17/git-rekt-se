const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Client signup route
 */

router.post('/signup', (req, res) => {
  res.send({
    message: 'This should be fun.',
  });
});

module.exports = router;
