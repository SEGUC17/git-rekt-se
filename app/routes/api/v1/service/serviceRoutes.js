const express = require('express');
const bodyParser = require('body-parser');
const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const Branch = require('../../../../models/service/Branch');
const Offering = require('../../../../models/service/Offering');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * View a service route
 */

router.get('/:id', (req, res, next) => {
  Service.findOne({
    _id: req.params.id,
  })
    .populate('_business branches categories')
    .exec()
    .then((service) => {
      res.json(service);
    })
    .catch((err) => {
      res.json({ errors: 'The specified Service was not found' });
    });
});

module.exports = router;
