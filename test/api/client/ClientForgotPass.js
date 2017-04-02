/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const clients = require('../../../app/seed/client/clientForgotPasswordSeed');
const Strings = require('../../../app/services/shared/Strings');
/**
 * Test Suite
 */

describe('Client forgot password API', () => {
  let req;

  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(() => {
        const data = clients[0];
        const clientData = {
          name: data.name,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          mobile: data.mobile,
          gender: data.gender,
          email: data.email,
        };

        /* eslint-disable no-new */

        new Client(clientData)
          .save()
          .then(() => done())
          .catch(done);
      });
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/client/auth/forgot');
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

        const eq = res.body.message === Strings.clientForgotPassword.CHECK_YOU_EMAIL ? 1 : 0;
        const chckMsg = eq;

        chai.expect(chckMsg)
          .to.equal(1);

        return done();
      });
  });


  /**
   * Passing test
   */

  it('should send an email to a valid client that is in the database', (done) => {
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

        const eq = res.body.message === Strings.clientForgotPassword.CHECK_YOU_EMAIL ? 1 : 0;
        const chckMsg = eq;

        chai.expect(chckMsg)
          .to.equal(1);

        return done();
      });
  });
});
