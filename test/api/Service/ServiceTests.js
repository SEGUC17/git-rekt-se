const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch.js');
const Service = require('../../../app/models/service/Service.js');
const Offering = require('../../../app/models/service/Offering');

const should = chai.should();
chai.use(chaiHttp);

describe('Services Tests', () => {
  it('it should GET a Service by the given id', (done) => {
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

    newService.save((newSer) => {
      const route = '/api/v1/visitor/'.concat(newService.id);
      chai.request(app)
        .get(route)
        .send(newService)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('shortDescription');
          res.body.should.have.property('description');
          res.body.should.have.property('_business');
          res.body.should.have.property('branches');
          res.body.should.have.property('reviews');
          res.body.should.have.property('offerings');
          res.body.should.have.property('gallery');
          res.body.should.have.property('_id').eql(newService.id);
          done();
        });
    });
  });

  it('it should not GET a Service by the non existence id', (done) => {
    const route = '/api/v1/visitor/'.concat(4);
    chai.request(app)
      .get(route)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});
