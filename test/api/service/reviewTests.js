const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app/app');

const clients = require('../../../app/seed/client/clientSeed');
const businesses = require('../../../app/seed/business/unverifiedBusinessSeed');
const branches = require('../../../app/seed/service/branchesSeed');
const services = require('../../../app/seed/service/servicesSeed');
const reviews = require('../../../app/seed/service/reviewsSeed');

const Client = require('../../../app/models/client/Client');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Service = require('../../../app/models/service/Service');
const Review = require('../../../app/models/service/Review');

const Strings = require('../../../app/services/shared/Strings');

mongoose.Promise = Promise;

/* Review CRUD test suite */


describe('Should create, update and delete reviews correctly', () => {
  let req;
  let serviceID;
  let clientID;
  let token;

  const client1 = new Client(clients[0]);
  client1.status = 'confirmed';

  const client1Login = {
    email: client1.email,
    password: client1.password,
  };

  const client2 = new Client(clients[1]);
  client2.status = 'confirmed';

  const client2Login = {
    email: client2.email,
    password: client2.password,
  };

  const business = new Business(businesses[0]);
  business._status = 'verified';

  const branch = new Branch(branches[0]);

  const service = new Service(services[0]);

  const review1 = new Review(reviews[0]);

  const review2 = new Review(reviews[1]);

  const review3 = new Review(reviews[2]);


  before((done) => {
    client1.save()
      .then((savedClient) => {
        clientID = `${savedClient._id}`;
        return client2.save();
      })
      .then(() => business.save())
      .then((savedBusiness) => {
        branch._business = savedBusiness._id;
        service._business = savedBusiness._id;
        return branch.save();
      })
      .then((savedBranch) => {
        service.branches = [savedBranch];
        return service.save();
      })
      .then((savedService) => {
        serviceID = `${savedService._id}`;
        done();
      })
      .catch({});
  });

  after((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes();
    });
    Business.collection.drop(() => {
      Business.ensureIndexes();
    });
    Branch.collection.drop(() => {
      Branch.ensureIndexes();
    });
    Service.collection.drop(() => {
      Service.ensureIndexes();
    });
    Review.collection.drop(() => {
      Service.ensureIndexes();
    });
    done();
  });


  beforeEach((done) => {
    supertest(app)
      .post('/api/v1/client/auth/login')
      .send(client1Login)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  // Passing test

  it('should create a review for the service specified', (done) => {
    req = supertest(app)
      .post(`/api/v1/service/${serviceID}/review`);
    req.set('Authorization', `JWT ${token}`);
    req.send(review1)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */
        if (err) {
          done(err);
        } else {
          chai.expect(res.body.message)
            .to.equal(Strings.reviewSuccess.createSuccess);
          Service.find()
            .populate('reviews')
            .exec()
            .then((testServices) => {
              const serviceToCheck = testServices[0];
              chai.expect(`${serviceToCheck.reviews[0]._client}`)
                .to.equal(clientID);
              chai.expect(serviceToCheck._totalRating)
                .to.equal(2);
              chai.expect(serviceToCheck._reviewCount)
                .to.equal(1);
              chai.expect(serviceToCheck._avgRating)
                .to.equal(2);
              done();
            })
            .catch(err2 => done(err2));
        }
      });
  });

  // Passing test

  it('should update the rating average correctly', (done) => {
    client2.save()
      .then(() => {
        supertest(app)
          .post('/api/v1/client/auth/login')
          .send(client2Login)
          .end((err2, res) => {
            token = res.body.token;
            req = supertest(app)
              .post(`/api/v1/service/${serviceID}/review`);
            req.set('Authorization', `JWT ${token}`);
            req.send(review2)
              .end((err3) => {
                if (err3) {
                  done(err3);
                } else {
                  Service.find()
                    .populate('reviews')
                    .exec()
                    .then((testServices) => {
                      const serviceToCheck = testServices[0];
                      chai.expect(serviceToCheck._totalRating)
                        .to.equal(5);
                      chai.expect(serviceToCheck._reviewCount)
                        .to.equal(2);
                      chai.expect(serviceToCheck._avgRating)
                        .to.equal(2.5);
                      done();
                    })
                    .catch(err4 => done(err4));
                }
              });
          });
      });
  });

  // Failing test

  it('should not create a review if I have already reviewed the same service', (done) => {
    req = supertest(app)
      .post(`/api/v1/service/${serviceID}/review`);
    req.set('Authorization', `JWT ${token}`);
    req.send(review1)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */
        if (err) {
          done(err);
        } else {
          console.log(res.body);
          chai.expect(res.body.errors[0].error)
            .to.equal(Strings.reviewErrors.alreadyReviewedService);
          done();
        }
      });
  });
});
