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
  let token;
  let sampleAdmin;

  beforeEach((done) => { // creating our dummy admin
    sampleAdmin = {
      email: 'abdobassiony996@hotmail.com',
      password: 'Strong#1234',
    };
    Admin.collection.drop(() => {
      Admin.ensureIndexes();
    });
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });

  beforeEach((done) => {
    new Admin(sampleAdmin)
      .save()
      .then(() => {
        req = supertest(app)
        .post('/api/v1/Admin/auth/login')
        .send({
          email: sampleAdmin.email,
          password: sampleAdmin.password,
        }).end((err, res) => {
          token = res.body.token;
          done();
        });
      })
      .catch(done);
  });

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
          Business.findOne({
            email: business.email,
          }, (findErr, data) => {
            if (findErr) {
              done(findErr);
            } else {
              req = supertest(app)
              .post(`/api/v1/admin/general/confirm/${data._id}`)
              .set('Authorization', `JWT ${token}`)
              .send()
      .expect('Content-Type', /json/)
      .expect(200)
      .end((confirmErr, result) => {
        if (confirmErr) {
          done(confirmErr);
        } else {
          chai.expect(result.body.message)
          .to.equal('Business confirmed successfully!');
          done();
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
      .expect(200)
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
      .expect(200)
      .end((confirmErr, result) => {
        // console.log(result.body);
        if (confirmErr) {
          done(confirmErr);
        } else {
          req = supertest(app)
      .post(`/api/v1/admin/general/confirm/${data._id}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(400)
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
