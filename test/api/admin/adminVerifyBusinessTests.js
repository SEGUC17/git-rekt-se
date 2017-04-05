const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Admin = require('../../../app/models/admin/Admin');
const unverifiedBussiness = require('../../../app/seed/business/unverifiedBusinessSeed');

/**
 * Administrator Verify Business.
 */

describe('Administrator Accept/Reject Business Application API', () => {
  let req;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZTNlZDJlNWNlYTdmMjM3MzU5NjEzMiIsImlhdCI6MTQ5MTMzMjU3MywiZXhwIjoxNDkyMTk2NTczfQ.tiOOgvaaZROG8DpY88MVnabi0bFq7u1SCN4Jpmj8OjY';
  let sampleAdmin;

  before((done) => { // creating our dummy admin
    sampleAdmin = {
      email: 'abdobassiony996@hotmail.com',
      password: 'Strong#1234',
    };
    // Admin.collection.drop(() => {
    //   Admin.ensureIndexes();
    // });
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });

  // beforeEach((done) => {
  //   req = supertest(app)
  //     .post('/api/v1/Admin/auth/login');
  //   req.send({
  //     email: sampleAdmin.email,
  //     password: sampleAdmin.password,
  //   }).end((err, res) => {
  //     // token = res.body.token;
  //     done();
  //   });
  // });

  /**
   * Accept a Business application
   */

  it('should confirm a valid business application', (done) => {
    const business = unverifiedBussiness[2]; // business with basic info
    req = supertest(app)
      .post('/api/v1/business/auth/unverified/signup') // submitting an application (basic signup)
      .send(business)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          console.log('------------------------res.body--------------------');
          console.log(res.body);
          Business.findOne({
            email: business.email,
          }).exec((findErr, data) => {
            console.log('------------------------find, data--------------------');
            console.log(data);
            if (findErr) {
              done(findErr);
            } else {
              req = supertest(app)
              .post(`/api/v1/admin/general/confirm/${data._id}`)
              .set('Authorization', `JWT ${token}`)
              .send()
      .expect('Content-Type', /json/)
      .end((confirmErr, result) => {
        // console.log(result.body);
        if (confirmErr) {
          done(confirmErr);
        } else {
          console.log(result.body);
          chai.expect(result.body)
          .to.equal('Business was succesfully confirmed.');
        }
      });
            }
          });
        }
      });
  });
  it('should not verify a business application that was already verified', (done) => {
    const business = unverifiedBussiness[2]; // business with basic info
    req = supertest(app)
      .post('/api/v1/business/auth/unverified/signup') // submitting an application (basic signup)
      .send(business)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: business.email,
          }).exec((findErr, data) => {
            if (findErr) {
              done(findErr);
            } else {
              req = supertest(app)
              .post(`/api/v1/admin/general/confirm/${data._id}`)
              .set('Authorization', `JWT ${token}`)
              .send()
      .expect('Content-Type', /json/)
      .end((confirmErr, result) => {
        // console.log(result.body);
        if (confirmErr) {
          done(confirmErr);
        } else {
          req = supertest(app)
      .post(`/api/v1/admin/general/confirm/${data._id}`)
      .send()
      .expect('Content-Type', /json/)
      .end((confirmErr2, result2) => {
        // console.log(result.body);
        if (confirmErr2) {
          chai.expect(result2.body)
          .to.equal('Business was already confirmed.');
          done(confirmErr2);
        }
        done();
      });
        }
      });
            }
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
