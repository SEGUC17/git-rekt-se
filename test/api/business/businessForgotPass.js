/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const businesses = require('../../../app/seed/business/businessForgotPassword');
const Strings = require('../../../app/services/shared/Strings');
/**
 * Test Suite
 */

describe('Business forgot password API', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        const data = businesses[0];
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
      .post('/api/v1/business/auth/forgot');
  });

  //   /**
  //    * Failing Test
  //    */

  it('should not send an email but tell the user to check their email regardless', (done) => {
    const mail1 = {
      email: 'hadyyasser2@gmail.com',
    };
    req.send(mail1)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */

        if (err) {
          return done(err);
        }

        /**
         * Do something with the response
         */

        const eq = res.body.message === Strings.businessForgotPassword.CHECK_YOU_EMAIL ? 1 : 0;
        const chckMsg = eq;

        chai.expect(chckMsg)
          .to.equal(1);

        return done();
      });
  });


  /**
   * Passing test
   */

  it('should send an email to a valid Business that is in the database', (done) => {
    const mail1 = {
      email: 'hadyyasser23@gmail.com',
    };
    req.send(mail1)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */

        if (err) {
          return done(err);
        }

        /**
         * Do something with the response
         */

        const eq = res.body.message === Strings.businessForgotPassword.CHECK_YOU_EMAIL ? 1 : 0;
        const chckMsg = eq;

        chai.expect(chckMsg)
          .to.equal(1);

        return done();
      });
  });
});
