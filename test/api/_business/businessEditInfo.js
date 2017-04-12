const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app/app');
const businesses = require('../../../app/seed/business/verifiedBusinessSeed');
const Business = require('../../../app/models/business/Business');


const notModifiedMail = {
  name: 'GUC german center',
  password: 'keytroniC1100',
  confirmPassword: 'keytroniC1100',
  email: 'hadyyasser23@gmail.com',
  shortDescription: 'test',
  phoneNumbers: ['01114804171'],
};

const modifiedMail = {
  name: 'GUC german center',
  password: 'keytroniC1100',
  confirmPassword: 'keytroniC1100',
  email: 'hadyyasser@me.com',
  shortDescription: 'test',
  phoneNumbers: ['01114804171'],
};

mongoose.Promise = Promise;

describe('Should update business information correctly', () => {
  let req;
  let token;

  beforeEach((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        const business1 = new Business(businesses[0]);
        business1.email = 'hadyyasser23@gmail.com';
        business1.password = 'Lenovo1100';
        business1.save()
          .then(() => {
            req = supertest(app)
              .post('/api/v1/business/auth/verified/login')
              .send({
                email: business1.email,
                password: 'Lenovo1100',
              })
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) {
                  done(err);
                } else {
                  token = res.body.token;
                  done();
                }
              });
          })
          .catch(err => done(err));
      });
    });
  });


  it('edit info without editing email', (done) => {
    const business1 = businesses[0];
    business1.email = 'hadyyasser23@gmail.com';
    Business.findOne({
      email: business1.email,
    })
      .exec()
      .then((business) => {
        supertest(app)
          .post('/api/v1/business/profile/'.concat(business._id)
            .concat('/edit'))
          .send(notModifiedMail)
          .expect('Content-Type', /json/)
          .set('Authorization', `JWT ${token}`)
          .end((err, res) => {
            /**
             * Error happend with request, fail the test
             * with the error message.
             */

            if (err) {
              done(err);
            } else {
              chai.expect(res.body)
                .to.have.property('message')
                .to.equal('Your information has been updated successfully.');
              done();
            }
          });
      })
      .catch(err => done(err));
  });

  /**
   * Passing test
   */

  it('edit info with editing email and send an email', (done) => {
    const business1 = businesses[0];
    business1.email = 'hadyyasser23@gmail.com';
    Business.findOne({
      email: business1.email,
    })
      .exec()
      .then((business) => {
        supertest(app)
          .post('/api/v1/business/profile/'.concat(business._id)
            .concat('/edit'))
          .send(modifiedMail)
          .expect('Content-Type', /json/)
          .set('Authorization', `JWT ${token}`)
          .end((err, res) => {
            /**
             * Error happend with request, fail the test
             * with the error message.
             */

            if (err) {
              done(err);
            } else {
              chai.expect(res.body)
                .to.have.property('message')
                .to.equal('Please check your email for the email confirmation.');
              done();
            }
          });
      })
      .catch(err => done(err));
  });
});
