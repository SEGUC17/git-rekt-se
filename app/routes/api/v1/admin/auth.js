const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Admin login route
 */

router.post('/login', (req, res) => {
  res.send({
    message: 'This should be fun.',
  });
});

module.exports = router;
