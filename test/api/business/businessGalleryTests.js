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

describe('Business Gallery CRUD Tests', () => {
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
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });

  it('should create an image, and return a confirmation message: Image added succesfully!', (done) => {
    //  const sampleService = ServiceSeed[0];
    //  sampleService._business = dbBusiness._id;
    /**
     {
  "message": "Business Login Success.",
  "id": "58e6283f0f3b971dcb469af2",
  "email": "sammas@gmail.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZTYyODNmMGYzYjk3MWRjYjQ2OWFmMiIsImlhdC
  I6MTQ5MTQ3ODg4NCwiZXhwIjoxNDkyMzQyODg0fQ.p_quye6tWd4755F_cGmRNfW7r_wlRQQvfSHB6fi61ow"
}
     */
    new Business(sampleBusiness)
      .save()
      .then((savedBus) => {
        // console.log(savedBus);
        req = supertest(app)
          .post(`/api/v1/business/gallery/addBusinessImage/${savedBus._id}`)
          .field('description', 'sample Image Description')
          .attach('path', '/home/youssef/Pictures/abc.png')
          .set('Authorization', `JWT ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, result) => {
            // console.log(2);
            if (err) {
              //   console.log(err);
              done(err);
            } else {
              Business.findOne({
                _id: savedBus._id,
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

  it('should not create an image if an invalid id is given, and return error message: Business not found!', (done) => {
    //  const sampleService = ServiceSeed[0];
    //  sampleService._business = dbBusiness._id;
    new Business(sampleBusiness)
      .save()
      .then((savedBus) => {
        req = supertest(app)
          .post('/api/v1/business/gallery/addBusinessImage/1x')
          .field('description', 'sample Image Description')
          .attach('path', '/home/youssef/Pictures/abc.png')
          .set('Authorization', `JWT ${token}`)
          .expect(400)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              chai.expect(res.body.error)
                .to.equal('The required id is invalid.');
              Business.findOne({
                _id: savedBus._id,
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


  //   it('should update an image description, and return success message:
  //  Description updated succesfully!', (done) => {
  //     const newService = new Service({
  //       name: 'Service1',
  //       shortDescription: 'Service 1 short description',
  //       description: 'Description',
  //       _business: sampleBusiness._id,
  //       branches: null,
  //       reviews: [],
  //       gallery: [],
  //     });
  //     const newImage = ({
  //       path: 'sampleImagePath',
  //       description: 'sample Image Description',
  //     });
  //     newService.gallery.push(newImage);
  //     newService.save()
  //       .then((newser) => {
  //         const newim = newser.gallery.find(element => `${element.path}` === 'sampleImagePath');
  //         req = supertest(app)
  //           .post(`/api/v1/service/editServiceImage/${newser._id}/${newim._id}`)
  //           .set('Authorization', `JWT ${token}`)
  //           .send({
  //             description: 'API Description is working',
  //           })
  //           .expect(200)
  //           .end((err, res) => {
  //             if (err) {
  //               done(err);
  //             } else {
  //               Service.findOne({
  //                 _id: newser._id,
  //               })
  //                 .exec()
  //                 .then((data) => {
  //                   chai.expect(res.body.message)
  //                     .to.equal(Strings.serviceSuccess.imageEdit);
  //                   const chaiImage =
  // data.gallery.find(element => `${element._id}` === `${newim._id}`);
  //                   chai.expect(chaiImage.description)
  //                     .to.equal('API Description is working');
  //                   done();
  //                 })
  //                 .catch(() => done(err));
  //             }
  //           });
  //       })
  //       .catch(err => done(err));
  //   });
  //   it('should delete an image description, and return success message: Image
  // deleted succesfully!', (done) => {
  //     const newService = new Service({
  //       name: 'Service1',
  //       shortDescription: 'Service 1 short description',
  //       description: 'Description',
  //       _business: sampleBusiness._id,
  //       branches: null,
  //       reviews: [],
  //       gallery: [],
  //     });
  //     const newImage = ({
  //       path: 'sampleImagePath',
  //       description: 'sample Image Description',
  //     });
  //     newService.gallery.push(newImage);
  //     newService.save()
  //       .then((newser) => {
  //         const newim = newser.gallery.find(element => `${element.path}` === 'sampleImagePath');
  //         req = supertest(app)
  //           .post(`/api/v1/service/deleteServiceImage/${newser._id}/${newim._id}`)
  //           .set('Authorization', `JWT ${token}`)
  //           .expect(200)
  //           .end((err, res) => {
  //             if (err) {
  //               done(err);
  //             } else {
  //               Service.findOne({
  //                 _id: newser._id,
  //               })
  //                 .exec()
  //                 .then((data) => {
  //                   chai.expect(res.body.message)
  //                     .to.equal(Strings.serviceSuccess.imageDelete);
  //                   chai.expect(data.gallery.length)
  //                     .to.equal(0);
  //                   done();
  //                 })
  //                 .catch(() => done(err));
  //             }
  //           });
  //       })
  //       .catch(err => done(err));
  //   });
});
