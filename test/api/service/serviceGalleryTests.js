const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');
const Strings = require('../../../app/services/shared/Strings');

const should = chai.should();
chai.use(chaiHttp);

/* eslint-disable no-underscore-dangle */

describe('Service Gallery CRUD Tests', () => {
  let req;
  beforeEach((done) => {
    Service.collection.drop(() => {
      Service.ensureIndexes(done);
    });
  });

  it('it should create an image, and return a confirmation message: Image added succesfully!', (done) => {
    const newBranch = new Branch({
      location: 'Nasr City',
      address: '123 nasr street',
    });


    newBranch.save((err, newbran) => {
      if (err) {
        console.log(err);
      } else {
        const newOffering = new Offering({
          branch: newbran._id,
          price: 1000,
          startDate: '1/1/2017',
          endDate: '1/1/2018',
        });
        newOffering.save((err2, newoff) => {
          if (err2) {
            console.log(err2);
          } else {
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
            newBusiness.branches.push(newbran.id);
            newBusiness.save((err3, newbus) => {
              if (err3) {
                console.log(err3);
              } else {
                const newService = new Service({
                  name: 'Service1',
                  shortDescription: 'Service 1 short description',
                  description: 'Description',
                  _business: newbus._id,
                  branches: newbran._id,
                  offerings: newoff._id,
                  reviews: [],
                  gallery: [],
                });
                newService.save((err4, newser) => {
                  if (err4) {
                    console.log(err4);
                  } else {
                    const newImage = ({
                      path: 'sampleImagePath',
                      description: 'sample Image Description',
                    });
                    req = supertest(app)
                      .post(`/api/v1/service/addServiceImage/${newser._id}`);
                    req.send(newImage)
                      .end((err5, res) => {
                        if (err5) {
                          done(err5);
                        } else {
                          chai.expect(res.body.message).to.equal(Strings.serviceSuccess.imageAdd);
                          Service.findOne({
                            _id: newser._id,
                          }, (finderr, data) => {
                            if (finderr) {
                              done(finderr);
                            } else {
                              chai.expect(data.gallery.length)
                                .to.equal(1);
                              done();
                            }
                          });
                        }
                      });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  it('it should not create an image if an invalid id is given, and return error message: Service not found!', (done) => {
    const newBranch = new Branch({
      location: 'Nasr City',
      address: '123 nasr street',
    });
    newBranch.save((err, newbran) => {
      if (err) {
        console.log(err);
      } else {
        const newOffering = new Offering({
          branch: newbran._id,
          price: 1000,
          startDate: '1/1/2017',
          endDate: '1/1/2018',
        });
        newOffering.save((err2, newoff) => {
          if (err2) {
            console.log(err2);
          } else {
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
            newBusiness.branches.push(newbran.id);
            newBusiness.save((err3, newbus) => {
              if (err3) {
                console.log(err3);
              } else {
                const newService = new Service({
                  name: 'Service1',
                  shortDescription: 'Service 1 short description',
                  description: 'Description',
                  _business: newbus._id,
                  branches: newbran._id,
                  offerings: newoff._id,
                  reviews: [],
                  gallery: [],
                });
                newService.save((err4, newser) => {
                  if (err4) {
                    console.log(err4);
                  } else {
                    const newImage = ({
                      path: 'sampleImagePath',
                      description: 'sample Image Description',
                    });
                    req = supertest(app)
                      .post('/api/v1/service/addServiceImage/4');
                    req.send(newImage)
                      .end((err5, res) => {
                        if (err5) {
                          done(err5);
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
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  it('it should update an image description, and return success message: Description updated succesfully!', (done) => {
    const newBranch = new Branch({
      location: 'Nasr City',
      address: '123 nasr street',
    });
    newBranch.save((err, newbran) => {
      if (err) {
        console.log(err);
      } else {
        const newOffering = new Offering({
          branch: newbran._id,
          price: 1000,
          startDate: '1/1/2017',
          endDate: '1/1/2018',
        });
        newOffering.save((err2, newoff) => {
          if (err2) {
            console.log(err2);
          } else {
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
            newBusiness.branches.push(newbran.id);
            newBusiness.save((err3, newbus) => {
              if (err3) {
                console.log(err3);
              } else {
                const newService = new Service({
                  name: 'Service1',
                  shortDescription: 'Service 1 short description',
                  description: 'Description',
                  _business: newbus._id,
                  branches: newbran._id,
                  offerings: newoff._id,
                  reviews: [],
                  gallery: [],
                });
                const newImage = ({
                  path: 'sampleImagePath',
                  description: 'sample Image Description',
                });
                newService.gallery.push(newImage);
                newService.save((err4, newser) => {
                  if (err4) {
                    console.log(err4);
                  } else {
                    const newim = newser.gallery.find(element => `${element.path}` === 'sampleImagePath');
                    req = supertest(app)
                      .post(`/api/v1/service/editServiceImage/${newser._id}/${newim._id}`);
                    req.send({
                      description: 'API Description is working',
                    })
                      .end((err5, res) => {
                        if (err5) {
                          done(err5);
                        } else {
                          chai.expect(res.body.message).to.equal(Strings.serviceSuccess.imageEdit);
                          Service.findOne({
                            _id: newser._id,
                          }, (finderr, data) => {
                            if (finderr) {
                              done(finderr);
                            } else {
                              const chaiImage = data.gallery.find(element => `${element._id}` === `${newim._id}`);
                              chai.expect(chaiImage.description).to.equal('API Description is working');
                              done();
                            }
                          });
                        }
                      });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
});
