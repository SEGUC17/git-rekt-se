/**
 * Verified Business API Tests
 */

const chai = require('chai');
const supertest = require('supertest');

const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const errorMessages = require('../../../app/services/shared/Strings')
  .bussinessValidationErrors;

const testData = require('../../../app/seed/business/businessSeed');

/**
 * Verified Business Sign Up Suite
 */

describe('Verified Business Sign Up API', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        const data = testData[0];
        const businessData = {
          name: data.name,
          email: data.email,
          description: data.description,
          phoneNumbers: data.phoneNumbers,
        };
        /* eslint-disable no-new */
        new Business(businessData)
          .save()
          .then(() => done())
          .catch(done);
      });
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/business/auth/confirm/123');
  });

  it('Should mark Business as verified', (done) => {
    const business = testData[0];
    const emailObj = {
      email: business.email,
    };
    req.send(business)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // We can use email since it's unique
          Business.find(emailObj, (findErr, result) => {
            if (findErr) {
              done(findErr);
            } else {
              /* eslint-disable no-underscore-dangle */
              chai.expect(result[0]._status)
                .to.equal('verified');
              done();
            }
          });
        }
      });
  });

  it('Should not allow sign up when password is missing', (done) => {
    req.send(testData[1])
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          const errors = res.body.errors;
          const finalErr = errors.filter(er => er.msg === errorMessages.passwordRequired);
          if (finalErr.length === 0) {
            done(new Error('Password is missing but an error is not sent!'));
          } else {
            done();
          }
        }
      });
  });

  it('Should not allow sign up when password mismatch', (done) => {
    req.send(testData[2])
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          const errors = res.body.errors;
          const finalErr = errors.filter(er => er.msg === errorMessages.passwordMismatch);
          if (finalErr.length === 0) {
            done(new Error('Passwords mismatch but an error is not sent!'));
          } else {
            done();
          }
        }
      });
  });

  it('Should not allow sign up when there are no categories', (done) => {
    req.send(testData[3])
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          const errors = res.body.errors;
          const finalErr = errors.filter(er => er.msg === errorMessages.categoriesRequired);
          if (finalErr.length === 0) {
            done(new Error('Missing Categories but an error is not sent'));
          } else {
            done();
          }
        }
      });
  });

  it('Should not allow sign up when there are no branches', (done) => {
    req.send(testData[4])
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          const errors = res.body.errors;
          const finalErr = errors.filter(er => er.msg === errorMessages.branchesRequired);
          if (finalErr.length === 0) {
            done(new Error('Missing Branches but an error is not sent'));
          } else {
            done();
          }
        }
      });
  });

  it('Should not allow sign up when there are no working hours', (done) => {
    req.send(testData[5])
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          const errors = res.body.errors;
          const finalErr = errors.filter(er => er.msg === errorMessages.workingHoursRequired);
          if (finalErr.length === 0) {
            done(new Error('Missing Working Hours but an error is not sent'));
          } else {
            done();
          }
        }
      });
  });
});
