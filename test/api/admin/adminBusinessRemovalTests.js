const chai = require('chai');
const path = require('path');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const BusinessesSeed = require('../../../app/seed/business/confirmBusinessSeeds');
const Admin = require('../../../app/models/admin/Admin');

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
    const business = BusinessesSeed[1];
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
                  .post(`/api/v1/admin/business/delete/${data._id}`)
                  .set('Authorization', `JWT ${token}`)
                  .send()
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((confirmErr2, result2) => {
                    if (confirmErr2) {
                      // chai.expect(result2.body.message)
                      //   .to.equal('Business was already confirmed.');
                      done(confirmErr2);
                    } else {
                      console.log('working..');
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
