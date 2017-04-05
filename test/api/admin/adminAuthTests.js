const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Admin = require('../../../app/models/admin/Admin');

/**
 * Admin Login Suite.
 */

describe('Administrator Login API', () => {
  let req;
  let sampleAdmin;

  before((done) => {
    sampleAdmin = {
      email: 'melzareios@gmail.com',
      password: 'Strong#1234',
    };

    Admin.collection.drop(() => {
      Admin.ensureIndexes(done);
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/Admin/auth/login');
  });

  it('should add an admin to test', (done) => {
    new Admin(sampleAdmin)
      .save()
      .then(() => done())
      .catch(done);
  });

  it('should login using email and password', (done) => {
    req
      .send({
        email: sampleAdmin.email,
        password: sampleAdmin.password,
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should include JWT token after login', (done) => {
    req.send({
      email: sampleAdmin.email,
      password: sampleAdmin.password,
    })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        const JWTtoken = res.body.token;
        const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

        chai.expect(JWTtoken)
          .to.match(JWS_REGEX);

        chai.expect(res.body.message)
          .to.equal('Admin Login Success.');

        chai.expect(res.body.email)
          .to.equal(sampleAdmin.email);

        done();
      });
  });

  it('should not login with wrong email', (done) => {
    const newAdmin = Object.assign({}, sampleAdmin);
    newAdmin.email = 'slim.abdelnadder@gmail.com';

    req.send({
      email: newAdmin.email,
      password: newAdmin.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with wrong password', (done) => {
    const newAdmin = Object.assign({}, sampleAdmin);
    newAdmin.password = 'youcantbeatme0';

    req.send({
      email: newAdmin.email,
      password: newAdmin.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with wrong email and wrong password', (done) => {
    const newAdmin = Object.assign({}, sampleAdmin);
    newAdmin.email = 'helloworld@gmail.com';
    newAdmin.password = 'youcantbeatme0';

    req.send({
      email: newAdmin.email,
      password: newAdmin.password,
    })
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: ['Invalid Credentials.'],
      }, done);
  });

  it('should not login with an empty email', (done) => {
    const newAdmin = Object.assign({}, sampleAdmin);
    newAdmin.email = '';

    req.send({
      email: newAdmin.email,
      password: newAdmin.password,
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
    const newAdmin = Object.assign({}, sampleAdmin);
    newAdmin.password = '';

    req.send({
      email: newAdmin.email,
      password: newAdmin.password,
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
    Admin.collection.drop(() => {
      Admin.ensureIndexes(done);
    });
  });
});
