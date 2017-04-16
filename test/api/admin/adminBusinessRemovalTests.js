const chai = require('chai');
const path = require('path');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const BusinessesSeed = require('../../../app/seed/business/businessSeed');
const Admin = require('../../../app/models/admin/Admin');
const Strings = require('../../../app/services/shared/Strings');
const locations = require('../../../app/seed/service/locations.js');

/**
 * Test Suite
 */

describe('Category CRUD Test Suite', () => {
  let req;
  let sampleAdmin;
  let token;

  before((done) => {
    sampleAdmin = new Admin({
      email: 'abdobassiony996@hotmail.com',
      password: 'Strong#1234',
    });
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
  it('should delete a business and return a confirmation message', (done) => {
    const business = BusinessesSeed[4];
    console.log(business);
    new Business(business)
      .save((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne({
            email: business.email,
          })
            .exec((Err2, bus) => {
              if (Err2) {
                done(Err2);
              } else {
                req = supertest(app)
                  .post(`/api/v1/admin/business/delete/${bus._id}`)
                  .set('Authorization', `JWT ${token}`)
                  .send()
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((Err3, result2) => {
                    if (Err3) {
                      done(Err3);
                    } else {
                      Business.findOne({
                        email: business.email,
                      })
                        .exec((Err4, bus2) => {
                          if (Err4) {
                            done(Err4);
                          } else {
                            console.log(bus2);
                            chai.expect(result2.body.message)
                              .to.equal(Strings.adminSuccess.businessDeleted);
                            done();
                          }
                        });
                    }
                  });
              }
            });
        }
      });
  });
  it('should not do anything on invalid ID input', (done) => {
    req = supertest(app)
      .post('/api/v1/admin/business/delete/x1')
      .set('Authorization', `JWT ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'id',
          msg: 'Invalid Business ID',
          value: 'x1',
        }],
      }, done);
  });
});
