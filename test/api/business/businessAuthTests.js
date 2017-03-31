/**
 * Verified Business API Tests
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');

const testData = [{
  password: 'blahblah',
  confirmPassword: 'blahblah',
  description: 'This is for testing the API',
  workingHours: 'Saturday To Thursday 8AM-5PM',
  categories: ['Language'],
  branches: ['Nasr City'],
}, {
  password: '',
  confirmPassword: 'blahblah',
  description: 'This is for testing the API',
  workingHours: 'Saturday To Thursday 8AM-5PM',
  categories: ['Language'],
  branches: ['Nasr City'],
}, {
  password: 'blabizo',
  confirmPassword: 'blahblah',
  description: 'This is for testing the API',
  workingHours: 'Saturday To Thursday 10AM-3PM',
  categories: ['Balabizo'],
  branches: ['New Cairo'],
}, {
  password: 'blahblah',
  confirmPassword: 'blahblah',
  description: 'This is for testing the API',
  workingHours: 'Saturday To Thursday 10AM-4PM',
  categories: [],
  branches: ['6th Of October'],
}, {
  password: 'blahblah',
  confirmPassword: 'blahblah',
  description: 'This is for testing the API',
  workingHours: 'Saturday To Thursday 10AM-3PM',
  categories: ['Balabizo'],
  branches: [],
}, {
  password: 'blahblah',
  confirmPassword: 'blahblah',
  description: 'This is for testing the API',
  workingHours: '',
  categories: ['Balabizo'],
  branches: ['New Cairo'],
}];

/**
 * Verified Business Sign Up Suite
 */

describe('Verified Business Sign Up API', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .post('/api/v1/business/auth/signup');
  });

  it('Should mark Business as verified', (done) => {
    const business = testData[0];
    req.send(business)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.find({}, (findErr, result) => {
            if (findErr) {
              done(findErr);
            } else {
              chai.expect(result[0].verified)
                .to.equal(true);
              done();
            }
          });
        }
      });
  });

  it('Should not allow sign up when password is missing', (done) => {
    req.send(testData[1])
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Password is a required field.',
      }, done);
  });

  it('Should not allow sign up when password mismatch', (done) => {
    req.send(testData[2])
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Passwords mismatch.',
      }, done);
  });

  it('Should not allow sign up when there are no categories', (done) => {
    req.send(testData[3])
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Must Include atleast 1 Category.',
      }, done);
  });

  it('Should not allow sign up when there are no branches', (done) => {
    req.send(testData[4])
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Must Include atleast 1 Branch.',
      }, done);
  });

  it('Should not allow sign up when there are no working hours', (done) => {
    req.send(testData[5])
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Working Hours is a required field.',
      }, done);
  });
});
