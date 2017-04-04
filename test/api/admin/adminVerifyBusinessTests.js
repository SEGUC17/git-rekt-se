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

  before((done) => { // creating our dummy admin
    Admin.collection.drop(() => {
      Admin.ensureIndexes();
      supertest(app)
      .post('/api/v1/admin/auth/create')
      .send()
      .end((err, res) => {
        supertest(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'mohamedelzarei@gmail.com',
        password: '',
      })
      .end((err2, res2) => {
        token = res2.body.token;
        console.log(token);
        done();
      });
      });
    });
  });

  beforeEach((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });

  /**
   * Accept a Business application
   */

  it('should confirm a valid business application', (done) => {
    const business = unverifiedBussiness[2]; // business with basic info]
    req = supertest(app)
      .post('/api/v1/business/auth/unverified/signup'); // submitting an application (basic signup)
    req.set('Authorization', `JWT ${token}`);
    req.send(business)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: 'abdobassiony996@hotmail.com',
          }).exec((findErr, data) => {
            if (findErr) {
              done(findErr);
            } else {
              req = supertest(app)
      .post(`/api/v1/admin/general/confirm/${data._id}`)
      .send()
    //   .expect('Content-Type', /json/)
      .end((confirmErr, result) => {
        console.log(result.body);
        if (confirmErr) {
          done(confirmErr);
        } else {
          chai.expect(data._status)
                .to.equal('verified');
          done();
        }
      });
            }
          });
        }
      });
  });
  it('should not verify a business application that was already verified', (done) => {
    const business = unverifiedBussiness[2]; // business with basic info]
    req = supertest(app)
      .post('/api/v1/business/auth/unverified/signup'); // submitting an application (basic signup)

    req.set('Authorization', `JWT ${token}`);
    req.send(business)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: 'abdobassiony996@hotmail.com',
          }).exec((findErr, data) => {
            if (findErr) {
              done(findErr);
            } else {
              req = supertest(app)
      .post(`/api/v1/admin/general/confirm/${data._id}`)
      .send()
    //   .expect('Content-Type', /json/)
      .end((confirmErr, result) => {
        console.log(result.body);
        if (confirmErr) {
          done(confirmErr);
        } else {
          req = supertest(app)
      .post(`/api/v1/admin/general/confirm/${data._id}`)
      .send()
      .end((confirmErr2, result2) => {
        console.log(result.body);
        if (confirmErr2) {
          done(confirmErr2);
        } else {
          chai.expect(result2.body)
          .to.equal('Business was already confirmed.');
        }
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
