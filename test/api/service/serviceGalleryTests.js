const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');
const Strings = require('../../../app/services/shared/Strings');
const BusinessesSeed = require('../../../app/seed/business/verifiedBusinessSeed');
const ServiceSeed = require('../../../app/seed/service/serviceSeed');

/* eslint-disable no-underscore-dangle */

describe('Service Gallery CRUD Tests', () => {
  let req;
  let token;
  let sampleBusiness;
  let dbBusiness;
  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        sampleBusiness = BusinessesSeed[4];
        new Business(sampleBusiness)
          .save()
          .then((data) => {
            sampleBusiness._id = data._id;
            dbBusiness = data;
            req = supertest(app)
              .post('/api/v1/business/auth/verified/login')
              .send(sampleBusiness)
              .end((err, res) => {
                token = res.body.token;
                done();
              });
          })
          .catch(done);
      });
    });
  });

  beforeEach((done) => {
    Service.collection.drop(() => {
      Service.ensureIndexes(done);
    });
  });

  it('should create an image, and return a confirmation message: Image added succesfully!', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post(`/api/v1/service/addServiceImage/${savedSer._id}`)
          .field('description', 'sample Image Description')
          .attach('path', '/home/abdelrahman-a-elshabrawy/Desktop/guc.png')
          .set('Authorization', `JWT ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, result) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data.gallery.length)
                    .to.equal(1);
                  chai.expect(result.body.message)
                    .to.equal('Image added successfully!');
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should not create an image if an invalid id is given, and return error message: Service not found!', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post('/api/v1/service/addServiceImage/1x')
          .field('description', 'sample Image Description')
          .attach('path', '/home/abdelrahman-a-elshabrawy/Desktop/guc.png')
          .set('Authorization', `JWT ${token}`)
          .expect(400)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              chai.expect(res.body.error).to.equal('Invalid Service ID');
              Service.findOne({
                _id: savedSer._id,
              }, (finderr, data) => {
                if (finderr) {
                  done(finderr);
                } else {
                  chai.expect(data.gallery.length)
                    .to.equal(0);
                  done();
                }
              });
            }
          });
      })
      .catch(err => done(err));
  });


  it('should update an image description, and return success message: Description updated succesfully!', (done) => {
    const newService = new Service({
      name: 'Service1',
      shortDescription: 'Service 1 short description',
      description: 'Description',
      _business: sampleBusiness._id,
      branches: null,
      reviews: [],
      gallery: [],
    });
    const newImage = ({
      path: 'sampleImagePath',
      description: 'sample Image Description',
    });
    newService.gallery.push(newImage);
    newService.save()
      .then((newser) => {
        const newim = newser.gallery.find(element => `${element.path}` === 'sampleImagePath');
        req = supertest(app)
          .post(`/api/v1/service/editServiceImage/${newser._id}/${newim._id}`)
          .set('Authorization', `JWT ${token}`)
          .send({
            description: 'API Description is working',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: newser._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(res.body.message)
                    .to.equal(Strings.serviceSuccess.imageEdit);
                  const chaiImage = data.gallery.find(element => `${element._id}` === `${newim._id}`);
                  chai.expect(chaiImage.description)
                    .to.equal('API Description is working');
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });
  it('should delete an image description, and return success message: Image deleted succesfully!', (done) => {
    const newService = new Service({
      name: 'Service1',
      shortDescription: 'Service 1 short description',
      description: 'Description',
      _business: sampleBusiness._id,
      branches: null,
      reviews: [],
      gallery: [],
    });
    const newImage = ({
      path: 'sampleImagePath',
      description: 'sample Image Description',
    });
    newService.gallery.push(newImage);
    newService.save()
      .then((newser) => {
        const newim = newser.gallery.find(element => `${element.path}` === 'sampleImagePath');
        req = supertest(app)
          .post(`/api/v1/service/deleteServiceImage/${newser._id}/${newim._id}`)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: newser._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(res.body.message)
                    .to.equal(Strings.serviceSuccess.imageDelete);
                  chai.expect(data.gallery.length)
                    .to.equal(0);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });
});
