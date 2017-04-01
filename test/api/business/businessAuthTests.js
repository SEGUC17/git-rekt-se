const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Admin = require('../../../app/models/admin/Admin');
const unverifiedBussiness = require('../../../app/seed/business/unverifiedBusinessSeed');

/**
 * Business Signup Suite
 */

describe('Unverified Business Signup API', () => {
  let req;

  before((done) => {
    supertest(app)
      .post('/api/v1/admin/auth/create')
      .end((request, res) => {
        Business.collection.drop(() => {
          Business.ensureIndexes(done);
        });
      });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/business/auth/unverified/signup');
  });

  /**
   * Register a new Business
   */

  it('should add a new business', (done) => {
    const business1 = unverifiedBussiness[0];
    req.send(business1)
      .expect('Content-Type', /json/)
      // .expect(200)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */
        if (err) {
          done(err);
        } else {
          Business.find({
            email: business1.email,
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

  it('should register add another business with different email.', (done) => {
    const business2 = unverifiedBussiness[1];
    req.send(business2)
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
          Business.find({
            email: business2.email,
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

  it('should have two unverified businesses in the database', (done) => {
    Business.find()
      .then((data) => {
        chai.expect(data.length)
          .to.equal(2);
        done();
      })
      .catch(done);
  });

  it('should not allow duplicate emails at registration', (done) => {
    const business1 = unverifiedBussiness[1];
    req.send(business1)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Business already exists.'],
      }, done);
  });

  it('should not allow registration with wrong information.', (done) => {
    const badBusiness = Object.assign({}, unverifiedBussiness[0]);
    badBusiness.mobile = '98172323212323';

    req.send(badBusiness)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'mobile',
          msg: 'Mobile must be in this format 01xxxxxxxxx',
          value: '98172323212323',
        }],
      }, done);
  });

  after((done) => {
    Admin.collection.drop(() => {
      Admin.ensureIndexes(done);
    });
  });
});
