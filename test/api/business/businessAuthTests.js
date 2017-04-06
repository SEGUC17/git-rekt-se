const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const InvalidToken = require('../../../app/models/shared/InvalidToken');
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

  it('should add another business with different email.', (done) => {
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


/**
 * Business Login Suite.
 */

describe('Business Login API', () => {
  let req;
  let sampleBusiness;

  before((done) => {
    sampleBusiness = {
      name: 'HelloWorld',
      email: 'melzareios@gmail.com',
      shortDescription: 'My life is good.',
      mobile: '01032454321',
      password: 'Strong#1234',
      _status: 'verified',
    };

    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/business/auth/verified/login');
  });

  it('should add a new dummy business to test', (done) => {
    new Business(sampleBusiness)
      .save()
      .then(() => done())
      .catch(done);
  });

  it('should login using email and password', (done) => {
    req
      .send({
        email: sampleBusiness.email,
        password: sampleBusiness.password,
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should include JWT token after login', (done) => {
    req.send({
      email: sampleBusiness.email,
      password: sampleBusiness.password,
    })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        const JWTtoken = res.body.token;
        const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

        chai.expect(JWTtoken)
          .to.match(JWS_REGEX);

        chai.expect(res.body.message)
          .to.equal('Business Login Success.');

        chai.expect(res.body.email)
          .to.equal(sampleBusiness.email);

        done();
      });
  });

  it('should not login with wrong email', (done) => {
    const newBusiness = Object.assign({}, sampleBusiness);
    newBusiness.email = 'slim.abdelnadder@gmail.com';

    req.send({
      email: newBusiness.email,
      password: newBusiness.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with wrong password', (done) => {
    const newBusiness = Object.assign({}, sampleBusiness);
    newBusiness.password = 'youcantbeatme0';

    req.send({
      email: newBusiness.email,
      password: newBusiness.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with wrong email and wrong password', (done) => {
    const newBusiness = Object.assign({}, sampleBusiness);
    newBusiness.email = 'helloworld@gmail.com';
    newBusiness.password = 'youcantbeatme0';

    req.send({
      email: newBusiness.email,
      password: newBusiness.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with an empty email', (done) => {
    const newBusiness = Object.assign({}, sampleBusiness);
    newBusiness.email = '';

    req.send({
      email: newBusiness.email,
      password: newBusiness.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'email',
          msg: 'Email is a required field.',
          value: '',
        },
        {
          param: 'email',
          msg: 'Invalid Email.',
          value: '',
        },
        ],
      }, done);
  });


  it('should not login with an empty password', (done) => {
    const newBusiness = Object.assign({}, sampleBusiness);
    newBusiness.password = '';

    req.send({
      email: newBusiness.email,
      password: newBusiness.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'password',
          msg: 'Password is a required field.',
          value: '',
        },
        {
          param: 'password',
          msg: 'Password length must be between 8 and 15 and contains at least one number.',
          value: '',
        },
        ],
      }, done);
  });
});

describe('Business Logout API', () => {
  it('should add token to invalid tokens', (done) => {
    supertest(app)
          .post('/api/v1/business/auth/verified/login')
          .send({
            email: 'melzareios@gmail.com',
            password: 'Strong#1234',
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              const token = res.body.token;
              const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
              chai.expect(token).to.match(JWS_REGEX);
              supertest(app)
                    .post('/api/v1/business/auth/logout')
                    .set('Authorization', `JWT ${token}`)
                    .end((e, result) => {
                      if (err) {
                        done(err);
                        return;
                      }
                      chai.expect(result.body.message).to.equal('You have been logged out.');

                      InvalidToken.findOne({
                        token,
                      }, (dberr, data) => {
                        if (dberr) {
                          done(dberr);
                          return;
                        }
                        chai.expect(data).not.to.equal(undefined);
                        done();
                      });
                    });
            }
          });
  });

  after((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });
});
