const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Business = require('../../../../models/business/Business');
const Service = require('../../../../models/service/Service');
const Strings = require('../../../../services/shared/Strings');


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
  const pattern = new RegExp('/^[0-9a-fA-F]{24}$/');
  const isValidId = pattern.test(req.params.id);

  if (isValidId) {
    Business.findOne({
      _id: req.params.id,
    }, {
      password: false,
      deleted: false,
      _status: 'verified',
    })
    .populate('branches categories')
    .exec()
    .then((business) => {
      Service.find({ business }).populate('branches offerings reviews').exec()
      .then((businessServices) => {
        const returnedBusiness = {
          _id: business.id,
          name: business.name,
          email: business.email,
          shortDescription: business.shortDescription,
          phoneNumbers: business.phoneNumbers,
          description: business.description,
          workingHours: business.workingHours,
          categories: business.categories,
          branches: business.branches,
          services: businessServices,
        };
        res.json(returnedBusiness);
      })
      .catch(e => next(e));
    })
    .catch((err) => {
      next(err);
    });
  } else {
    res.json({ message: Strings.bussinessValidationErrors.invalidBusinessId });
  }
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
