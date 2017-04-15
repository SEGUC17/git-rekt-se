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
const clients = require('../../../app/seed/client/clientSeed');
const reviews = require('../../../app/seed/service/reviewSeed');
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
          .field('description', 'Test')
          .expect('Content-Type', /json/)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              console.log(res.body);
              chai.expect(review2.reports[0].description)
                .to.equal('Test');
              chai.expect(res.body.message)
                .to.equal(Strings.adminSuccess.reviewReported);
              done();
            }
          });
      })
      .catch(done);
  });

  it('should not add a report and return an error message', (done) => {
    req = supertest(app)
      .post('/api/v1/client/review/report/4')
      .set('Authorization', `JWT ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'id',
          msg: 'Invalid Review ID',
          value: '4',
        }],
      }, done);
  });
  after((done) => {
    Review.collection.drop(() => {
      Review.ensureIndexes(done);
    });
  });
});
