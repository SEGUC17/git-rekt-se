const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../../models/admin/Admin.js');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * Dummy admin registeration route
 * FOR TESTING PURPOSES
 */

router.post('/create', (req, res) => {
  console.log(1);
  new Admin({
    email: 'mohamedelzarei@gmail.com',
    password: 'helloworld',
  })
    .save()
    .then(() => res.json({
      message: 'Dummy admin added.',
    }));
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
