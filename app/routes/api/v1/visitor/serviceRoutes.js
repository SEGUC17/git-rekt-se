const express = require('express');
const bodyParser = require('body-parser');
const Business = require('../../../../models/business/Business.js');
const Service = require('../../../../models/service/Service.js');
const Branch = require('../../../../models/service/Branch.js');
const Offering = require('../../../../models/service/Offering.js');

const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
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

  const newOffering = new Offering({
    branch: newBranch.id,
    price: 1000,
    startDate: '1/1/2017',
    endDate: '1/1/2018',
  });

  newOffering.save((err, newoff) => {
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

  newBusiness.save((err, newbus) => {
    if (err) {
      console.log(err);
    }
  });

  const newService = new Service({
    name: 'Service1',
    shortDescription: 'Service 1 short description',
    description: 'Description',
    _business: newBusiness.id,
    branches: newBranch.id,
    offerings: newOffering.id,
    reviews: [],
    gallery: {},
  });

  newService.save((err, newcat) => {
    if (err) {
      console.log(err);
    }
    res.send('done');
  });
});

/**
 * Search for a service route
 */

router.get('/:id', (req, res, next) => {
  Service.findOne({
    _id: req.params.id,
  })
    .populate('_business branches offerings')
    .exec((err, service) => {
      if (err) {
        return next(err);
      }
      const returnedService = {
        name: service.name,
        shortDescription: service.shortDescription,
        description: service.description,
        business: service.business,
        branches: service.branches,
        offerings: service.offerings,
        reviews: service.reviews,
        gallery: service.gallery,
      };
      res.json(service);
      return returnedService;
    });
});

module.exports = router;
