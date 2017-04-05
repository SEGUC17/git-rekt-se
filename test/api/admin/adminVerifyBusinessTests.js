const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Admin = require('../../../app/models/admin/Admin');
const BusinessesSeed = require('../../../app/seed/business/confirmBusinessSeeds');

/**
 * Administrator Verify Business.
 */

describe('Administrator Accept/Reject Business Application API', () => {
  let req;
  let token;


  before((done) => { // creating our dummy admin
    const sampleAdmin = {
      email: 'abdobassiony996@hotmail.com',
      password: 'Strong#1234',
    };
    Admin.collection.drop(() => {
      Admin.ensureIndexes(() => {
        new Admin(sampleAdmin)
          .save()
          .then(() => {
            req = supertest(app)
              .post('/api/v1/Admin/auth/login')
              .send({
                email: sampleAdmin.email,
                password: sampleAdmin.password,
              })
              .end((err, res) => {
                token = res.body.token;
                done();
              });
          })
          .catch(done);
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
    const business = BusinessesSeed[0]; // business with basic info, and unverified
    new Business(business)
      .save((err, res) => {
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
    const business = BusinessesSeed[1]; // business with basic info, and verified
    new Business(business)
      .save((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: business.email,
          })
            .exec((findErr, data) => {
              if (findErr) {
                done(findErr);
              } else {
                req = supertest(app)
                  .post(`/api/v1/admin/general/confirm/${data._id}`)
                  .set('Authorization', `JWT ${token}`)
                  .send()
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .end((confirmErr2, result2) => {
                    if (confirmErr2) {
                      chai.expect(result2.body.message)
                        .to.equal('Business was already confirmed.');
                      done(confirmErr2);
                    } else {
                      done();
                    }
                  });
              }
            });
        }
      });
  });

  it('should not verify a business application that was already rejected', (done) => {
    const business = BusinessesSeed[2]; // business with basic info, and rejected
    new Business(business)
      .save((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: business.email,
          })
            .exec((findErr, data) => {
              if (findErr) {
                done(findErr);
              } else {
                req = supertest(app)
                  .post(`/api/v1/admin/general/confirm/${data._id}`)
                  .set('Authorization', `JWT ${token}`)
                  .send()
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .end((confirmErr2, result2) => {
                    if (confirmErr2) {
                      chai.expect(result2.body.message)
                        .to.equal('Business was already rejected.');
                      done(confirmErr2);
                    } else {
                      done();
                    }
                  });
              }
            });
        }
      });
  });

  it('should reject a business application', (done) => {
    const business = BusinessesSeed[0]; // business with basic info, and unverified
    new Business(business)
      .save((err, res) => {
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
                .post(`/api/v1/admin/general/deny/${data._id}`)
                .set('Authorization', `JWT ${token}`)
                .send()
                .expect('Content-Type', /json/)
                .expect(200)
                .end((confirmErr, result) => {
                  if (confirmErr) {
                    done(confirmErr);
                  } else {
                    chai.expect(result.body.message)
                      .to.equal('Business request denied.');
                    done();
                  }
                });
            }
          });
        }
      });
  });
  it('should not reject a business application that was already verified', (done) => {
    const business = BusinessesSeed[1]; // business with basic info, and verified
    new Business(business)
      .save((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: business.email,
          })
            .exec((findErr, data) => {
              if (findErr) {
                done(findErr);
              } else {
                req = supertest(app)
                  .post(`/api/v1/admin/general/deny/${data._id}`)
                  .set('Authorization', `JWT ${token}`)
                  .send()
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .end((confirmErr2, result2) => {
                    if (confirmErr2) {
                      chai.expect(result2.body.message)
                        .to.equal('Business was already confirmed.');
                      done(confirmErr2);
                    } else {
                      done();
                    }
                  });
              }
            });
        }
      });
  });

  it('should not reject a business application that was already rejected', (done) => {
    const business = BusinessesSeed[2]; // business with basic info, and rejected
    new Business(business)
      .save((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: business.email,
          })
            .exec((findErr, data) => {
              if (findErr) {
                done(findErr);
              } else {
                req = supertest(app)
                  .post(`/api/v1/admin/general/deny/${data._id}`)
                  .set('Authorization', `JWT ${token}`)
                  .send()
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .end((confirmErr2, result2) => {
                    if (confirmErr2) {
                      chai.expect(result2.body.message)
                        .to.equal('Business was already rejected.');
                      done(confirmErr2);
                    } else {
                      done();
                    }
                  });
              }
            });
        }
      });
  });

  it('should not do anything on invalid ID input', (done) => {
    req = supertest(app)
      .post('/api/v1/admin/general/confirm/x1')
      .set('Authorization', `JWT ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'id',
          msg: 'Invalid Business ID',
          value: 'x1',
        },
        ],
      }, done);
  });


  after((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
  });
});
