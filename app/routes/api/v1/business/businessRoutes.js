const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business.js');
const Branch = require('../../../../models/service/Branch');
const Category = require('../../../../models/service/Category.js');


mongoose.Promise = Promise;
const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * View business page
 */
router.get('/:id', (req, res, next) => {
  Business.findOne({
    _id: req.params.id,
  })
    .populate('branches categories')
    .exec()
    .then((business) => {
      res.json(business);
    })
    .catch((err) => {
      res.json({ errors: 'The specified business was not found' });
    });
});

/**
 *  Error Handling Middlewares.
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});
module.exports = router;
