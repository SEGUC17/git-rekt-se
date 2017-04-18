/**
 * API Testing Template
 */

const chai = require('chai');
const path = require('path');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const Review = require('../../../app/models/service/Review');
const Admin = require('../../../app/models/admin/Admin');
const Service = require('../../../app/models/service/Service');
const clients = require('../../../app/seed/client/clientSeed');
const reviews = require('../../../app/seed/service/reviewSeed');
const servicesSeed = require('../../../app/seed/service/servicesSeed');
const Strings = require('../../../app/services/shared/Strings.js');

/**
 * Test Suite
 */

describe('Review Reporting Test Suite', () => {
  let req;
  let sampleAdmin;
  let token;

  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(() => {
        Client.insertMany(clients[1])
          .then(() => {
            const newClient = Object.assign({}, clients[0]);
            newClient.status = 'confirmed';

            new Client(newClient)
              .save()
              .then(() => {
                req = supertest(app)
                  .post('/api/v1/client/auth/login')
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
                      token = res.body.token;
                      done();
                    }
                  });
              })
              .catch(done);
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });

  beforeEach((done) => {
    Review.collection.drop(() => {
      Review.ensureIndexes(done);
    });
  });

  it('should add a report and return a confirmation message', (done) => {
    const review1 = reviews[0];
    new Review(review1)
      .save()
      .then((review2) => {
        req = supertest(app)
          .post(`/api/v1/client/review/report/${review2._id}`)
          .expect('Content-Type', /json/)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Review.findOne({
                _id: review2._id,
              }, (err2, result2) => {
                chai.expect(result2.reports)
                  .to.equal(1);
                chai.expect(res.body.message)
                  .to.equal('Review reported successfully!');
                done();
              });
            }
          });
      })
      .catch(done);
  });

  it('should not add a report and return an error message', (done) => {
    req = supertest(app)
      .post('/api/v1/client/review/report/4')
      .field('description', 'Test')
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'id',
          msg: 'Invalid Review ID',
          value: '4',
        }],
      }, done);
  });
  // after((done) => {
  //   Review.collection.drop(() => {
  //     Review.ensureIndexes(done);
  //   });
  // });
});
