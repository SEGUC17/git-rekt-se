const express = require('express');
const bodyParser = require('body-parser');
const Business = require('../../../../models/business/Business.js');
const Branch = require('../../../../models/service/Branch.js');
const Category = require('../../../../models/service/Category.js');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());

/**
 * View business page
 */
router.get('/:id', (req, res, next) => {
  Business.findOne({ _id: req.params.id }).populate('branches categories').exec((err, business) => {
    if (err) {
      return next(err);
    }

    const returnedBusiness = {
      name: business.name,
      email: business.email,
      shortDescription: business.shortDescription,
      phoneNumbers: business.phoneNumbers,
      categories: business.categories,
      branches: business.branches,
      gallery: business.gallery,
      description: business.description,
      workingHours: business.workingHours,
      id: business.id,
    };
    res.json(returnedBusiness);
    return returnedBusiness;
  });
});
module.exports = router;
