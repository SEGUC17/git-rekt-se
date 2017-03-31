/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const clients = require('../../../app/seed/client/clientSeed');

/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * Client Signup Suite
 */

describe('Client Signup API', () => {
  let req;

  before((done) => {
    Client.collection.drop();
    Client.ensureIndexes(done);
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
            console.log(1);
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

  it('should not allow same email for multiple users', (done) => {
    const client1 = clients[0];
    req.send(client1)
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Client account already exists.',
      }, done);
  });
});
