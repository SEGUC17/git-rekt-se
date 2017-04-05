const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');
const Strings = require('../../../app/services/shared/Strings');
const BusinessesSeed = require('../../../app/seed/business/verifiedBusinessSeed');

/* eslint-disable no-underscore-dangle */

describe('Service Gallery CRUD Tests', () => {
  let req;
  let token;
  let sampleBusiness;
  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        sampleBusiness = BusinessesSeed[4];
        new Business(sampleBusiness)
          .save()
          .then(() => {
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
    const newImage = ({
      path: 'sampleImagePath',
      description: 'sample Image Description',
    });

    req = supertest(app)
      .post(`/api/v1/service/addServiceImage/${sampleBusiness._id}`)
      .set('Authorization', `JWT ${token}`)
      .send(newImage)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, result) => {
        if (err) {
          done(err);
        } else {
          Service.findOne({
            _id: sampleBusiness._id,
          })
            .exec()
            .then((data) => {
              chai.expect(data.gallery.length)
                .to.equal(1);
              chai.expect(result.body.message)
                .to.equal('Image added successfully!');
              done();
            });
        }
      });
  });

  it('should not create an image if an invalid id is given, and return error message: Service not found!', (done) => {
    const newBranch = new Branch({
      location: 'Nasr City',
      address: '123 nasr street',
    });
    newBranch
      .save((newbran) => {
        const newService = new Service({
          name: 'Service1',
          shortDescription: 'Service 1 short description',
          description: 'Description',
          _business: sampleBusiness._id,
          branches: newbran._id,
          reviews: [],
          gallery: [],
        });
        newService.save()
          .then((newser) => {
            const newImage = ({
              path: 'sampleImagePath',
              description: 'sample Image Description',
            });

            req = supertest(app)
              .post('/api/v1/service/addServiceImage/4')
              .set('Authorization', `JWT ${token}`)
              .send(newImage)
              .end((err, res) => {
                if (err) {
                  done(err);
                } else {
                  chai.expect(res.body.message)
                    .to.equal(Strings.serviceFail.invalidService);
                  Service.findOne({
                    _id: newser._id,
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
          });
      });
  });


  it('should update an image description, and return success message: Description updated succesfully!', (done) => {
    const newBranch = new Branch({
      location: 'Nasr City',
      address: '123 nasr street',
    });
    newBranch.save()
      .then((newbran) => {
        const newService = new Service({
          name: 'Service1',
          shortDescription: 'Service 1 short description',
          description: 'Description',
          _business: sampleBusiness._id,
          branches: newbran._id,
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
            const newim = newser.gallery.findOne(element => `${element.path}` === 'sampleImagePath');
            req = supertest(app)
              .post(`/api/v1/service/editServiceImage/${newser._id}/${newim._id}`)
              .set('Authorization', `JWT ${token}`)
              .send({
                description: 'API Description is working',
              })
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
                    .catch(err);
                }
              });
          });
      });
  });
});
