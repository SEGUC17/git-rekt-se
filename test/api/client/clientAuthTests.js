const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const clients = require('../../../app/seed/client/clientSeed');

/**
 * Client Signup Suite
 */

describe('Client Signup API', () => {
  let req;

  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(done);
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/client/auth/signup');
  });

  /**
   * Register a new client
   */

  it('should register a new client', (done) => {
    const client1 = clients[0];
    req.send(client1)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */

        if (err) {
          done(err);
        } else {
          Client.find({
            email: client1.email,
          }, (finderr, data) => {
            if (finderr) {
              done(finderr);
            } else {
              chai.expect(data.length)
                .to.equal(1);
              done();
            }
          });
        }
      });
  });

  it('should register a another client with different email.', (done) => {
    const client2 = clients[1];
    req.send(client2)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */

        if (err) {
          done(err);
        } else {
          Client.find({
            email: client2.email,
          }, (finderr, data) => {
            if (finderr) {
              done(finderr);
            } else {
              chai.expect(data.length)
                .to.equal(1);
              done();
            }
          });
        }
      });
  });

  it('should have two users in the database', (done) => {
    Client.find()
      .then((data) => {
        chai.expect(data.length)
          .to.equal(2);
        done();
      })
      .catch(done);
  });

  it('should not allow duplicate emails at registration', (done) => {
    const client1 = clients[1];
    req.send(client1)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['User already exists.'],
      }, done);
  });

  it('should not allow registration with mis-matching passwords', (done) => {
    const badClient = Object.assign({}, clients[0]);
    badClient.confirmPassword = 'YEQmxoav4NK';

    req.send(badClient)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'confirmPassword',
          msg: 'Password and Password Confirmation must match.',
          value: 'YEQmxoav4NK',
        }],
      }, done);
  });
});
