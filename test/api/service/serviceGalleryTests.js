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

describe('Service Gallery Creation Tests', () => {
  let req;
  beforeEach((done) => {
    Service.collection.drop(() => {
      Service.ensureIndexes(done);
    });
  });

  it('it should Create an Image and get a confirmation message', (done) => {
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
      shortDescription: 'This item is for testing Gallery Image Creation API',
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

    newService.save((err, newser) => {
      if (err) {
        console.log(err);
      }
    });

    const newImage = ({
      path: 'sampleImagePath',
      description: 'sample Image Description',
    });


    req = supertest(app)
      .post(`/api/v1/service//addServiceImage/:${newService._id}`);
    req.send(newImage)
      .expect(200, {
        message: 'Image added succesfully!',
      })
      .end((err, res) => {
        done(err);
        if (err) {
          done(err);
        } else {
          chai.expect(Service.find({
            id: newService._id,
          })
            .gallery.length)
            .to.equal(1);
        }
      });
  });

  it('it should not Create an Image if an invalid id is given', (done) => {
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
      shortDescription: 'This item is for testing Gallery image Creation API',
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
      name: 'Service',
      shortDescription: 'Service short description',
      description: 'Description2',
      _business: newBusiness.id,
      branches: newBranch.id,
      offerings: newOffering.id,
      reviews: [],
      gallery: {},
    });

    newService.save((err, newser) => {
      if (err) {
        console.log(err);
      }
    });
    const newImage = ({
      path: 'sampleImagePath',
      description: 'sample Image Description',
    });

    req = supertest(app)
      .post('/api/v1/service//addServiceImage/:900000000');
    req.send(newImage)
      .expect(400, {
        message: 'Invalid service!',
      })
      .end((err, res) => {
        done(err);
        if (err) {
          done(err);
        } else {
          chai.expect(Service.find({
            id: newService._id,
          })
            .gallery.length)
            .to.equal(0);
        }
      });
  });
});
