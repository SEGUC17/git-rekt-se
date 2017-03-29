const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Search for a service route
 */

router.get('/search/:query', (req, res) => {
  res.send({
    message: `This should be fun => + ${req.params.query}`,
  });
});

module.exports = router;
