const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const clients = require('../../../app/seed/client/clientForgotPasswordSeed');

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


/**
 * Client Login Suite
 */

describe('Client Login API', () => {
  let req;
  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(done);
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/client/auth/login');
  });

  it('should login using email and password', (done) => {
    /**
     * Add a dummy client to DB.
     */
    const newClient = Object.assign({}, clients[0]);
    newClient.status = 'confirmed';

    new Client(newClient)
      .save()
      .then(() => {
        req
          .send({
            email: clients[0].email,
            password: clients[0].password,
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      })
      .catch(done);
  });

  it('should include JWT token after login', (done) => {
    req.send({
      email: clients[0].email,
      password: clients[0].password,
    })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        const JWTtoken = res.body.token;
        const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

        chai.expect(JWTtoken)
          .to.match(JWS_REGEX);

        chai.expect(res.body.message)
          .to.equal('Client Login Success.');

        chai.expect(res.body.email)
          .to.equal(clients[0].email);

        done();
      });
  });

  it('should not login with wrong email', (done) => {
    const newClient = Object.assign({}, clients[0]);
    newClient.email = 'slim.abdelnadder@gmail.com';

    req.send({
      email: newClient.email,
      password: newClient.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with wrong password', (done) => {
    const newClient = Object.assign({}, clients[0]);
    newClient.password = 'youcantbeatme0';

    req.send({
      email: newClient.email,
      password: newClient.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with wrong email and wrong password', (done) => {
    const newClient = Object.assign({}, clients[0]);
    newClient.email = 'helloworld@gmail.com';
    newClient.password = 'youcantbeatme0';

    req.send({
      email: newClient.email,
      password: newClient.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with an empty email', (done) => {
    const newClient = Object.assign({}, clients[0]);
    newClient.email = '';

    req.send({
      email: newClient.email,
      password: newClient.password,
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
    const newClient = Object.assign({}, clients[0]);
    newClient.password = '';

    req.send({
      email: newClient.email,
      password: newClient.password,
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

  after((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(done);
    });
  });
});
