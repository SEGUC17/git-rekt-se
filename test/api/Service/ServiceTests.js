const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');

/**
 * Database Connection
 */

require('dotenv')
  .config();

describe('View Services Tests', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes();
    });
    Service.collection.drop(() => {
      Service.ensureIndexes();
    });
    Offering.collection.drop(() => {
      Offering.ensureIndexes();
    });
    Branch.collection.drop(() => {
      Branch.ensureIndexes(done);
    });
  });

  beforeEach(() => {
    req = supertest(app);
  });
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
      gallery: null,
    });

    newService.save((newSer) => {
      const route = '/api/v1/service/'.concat(newService.id);
      req.get(route)
        .send(newService)
        .end((err, res) => {
          chai.expect(res.body).to.have.property('name');
          chai.expect(res.body).to.have.property(('shortDescription'));
          chai.expect(res.body).to.have.property(('description'));
          chai.expect(res.body).to.have.property(('branches'));
          chai.expect(res.body).to.have.property(('workingHours'));
          chai.expect(res.body).to.have.property(('offerings'));
          chai.expect(res.body).to.have.property(('reviews'));
          done();
        });
    });
  });

  it('it should not GET a Service by the non existence id', (done) => {
    const route = '/api/v1/service/'.concat(4);
    req.get(route)
      .end((err, res) => {
        chai.expect(res.body).to.have.property('errors');
        done();
      });
  });
});
