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
        password: 'helloworld',
      })
      .end((err2, res2) => {
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
    const business = unverifiedBussiness[2]; // business with basic info
    req = supertest(app)
      .post('/api/v1/business/auth/unverified/signup'); // submitting an application (basic signup)

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
  after((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });
});
