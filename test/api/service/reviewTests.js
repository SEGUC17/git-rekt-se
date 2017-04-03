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

  const review2 = reviews[1];

  const review3 = reviews[2];

  before((done) => {
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
    done();
  });


  beforeEach((done) => {
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
        supertest(app)
          .post('/api/v1/client/auth/login')
          .send(client1Login)
          .end((err, res) => {
            token = res.body.token;
            done();
          });
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
        }
        chai.expect(res.body.message)
          .to.equal(Strings.reviewSuccess.createSuccess);
        done();
      });
  });
});
