const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Strings = require('../../../app/services/shared/Strings');
const BusinessesSeed = require('../../../app/seed/business/verifiedBusinessSeed');

/* eslint-disable no-underscore-dangle */

describe('Business Gallery CRUD Tests', () => {
  let req;
  let token;
  let sampleBusiness;
  let dbBusiness;
  beforeEach((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        sampleBusiness = BusinessesSeed[4];
        new Business(sampleBusiness)
          .save()
          .then((data) => {
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

  it('should create an image, and return a confirmation message: Image added succesfully!', (done) => {
    req = supertest(app)
      .post(`/api/v1/business/gallery/addBusinessImage/${dbBusiness._id}`)
      .field('description', 'sample Image Description')
      .attach('path', '/home/youssef/Pictures/abc.png')
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, result) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            _id: dbBusiness._id,
          })
            .exec()
            .then((data) => {
              chai.expect(data.gallery.length)
                .to.equal(1);
              chai.expect(result.body.message)
                .to.equal('Image added successfully!');
              done();
            })
            .catch(() => {
              done(err);
            });
        }
      });
  });

  it('should not create an image if an invalid id is given, and return error message: Business not found!', (done) => {
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
            _id: dbBusiness._id,
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


  it('should update an image description, and return success message: Description updated succesfully!', (done) => {
    const newImage = ({
      path: 'sampleImagePath',
      description: 'sample Image Description',
    });
    dbBusiness.gallery.push(newImage);
    dbBusiness.save()
      .then((newbus) => {
        const newim = newbus.gallery.find(element => `${element.path}` === 'sampleImagePath');
        req = supertest(app)
          .post(`/api/v1/business/gallery/editBusinessImage/${dbBusiness._id}/${newim._id}`)
          .set('Authorization', `JWT ${token}`)
          .send({
            description: 'API Description is working',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Business.findOne({
                _id: dbBusiness._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(res.body.message)
                    .to.equal(Strings.serviceSuccess.imageEdit);
                  const chaiImage =
                    data.gallery.find(element => `${element._id}` === `${newim._id}`);
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
    const newImage = ({
      path: 'sampleImagePath',
      description: 'sample Image Description',
    });
    dbBusiness.gallery.push(newImage);
    dbBusiness.save()
      .then((newbus) => {
        const newim = newbus.gallery.find(element => `${element.path}` === 'sampleImagePath');
        req = supertest(app)
          .post(`/api/v1/business/gallery/deleteBusinessImage/${dbBusiness._id}/${newim._id}`)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Business.findOne({
                _id: dbBusiness._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(res.body.message)
                    .to.equal(Strings.serviceSuccess.imageDelete);
                  chai.expect(data.gallery.length)
                    .to.equal(0);
                  done();
                })
                .catch(err2 => done(err2));
            }
          });
      })
      .catch(err => done(err));
  });
});
