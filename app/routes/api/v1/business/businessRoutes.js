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
 * Inserting dummy data for testing
 */

router.get('/insert', (req, res, next) => {
  const newBranch = new Branch({
    location: 'Nasr City',
    address: '123 nasr street',
  });

  newBranch.save((err, newbran) => {
    if (err) {
      console.log(err);
    }
  });

  const newCategory = new Category({
    type: 'Service',
    title: 'Nasr City',
  });

  newCategory.save((err, newcat) => {
    if (err) {
      console.log(err);
    }
  });

  const newBusiness = new Business({
    name: 'hobala25',
    email: 'test@gmail.com',
    shortDescription: 'This item is for testing the Business SignUp API',
    phoneNumbers: ['12345677', '22222222', '32414553'],
    password: 'blahblah1',
    confirmPassword: 'blahblah1',
    description: 'This is for testing the API',
    workingHours: 'Saturday To Thursday 8AM-5PM',
  });
  newBusiness.branches.push(newBranch.id);
  newBusiness.categories.push(newCategory.id);
  newBusiness.save((err, newBuss) => {
    if (err) {
      console.log(err);
    } else {
      res.send('hob');
    }
  });
});

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
      _id : business._id,
    };
    res.json(returnedBusiness);
    return returnedBusiness;
  });
});
module.exports = router;
