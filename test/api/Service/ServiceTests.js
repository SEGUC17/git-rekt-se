const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Review = require('../../../app/models/service/Review');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');
const services = require('../../../app/seed/service/serviceSeed');
const businesses = require('../../../app/seed/business/businessSeed');
const branches = require('../../../app/seed/service/branchesSeed');
const reviews = require('../../../app/seed/service/reviewSeed');

let businessID;
let branchID;

require('dotenv')
  .config();

describe('Droping the databases', () => {
  it('Removing collections', (done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Service.collection.drop(() => {
          Service.ensureIndexes(() => {
            Branch.collection.drop(() => {
              Branch.ensureIndexes(() => {
                Review.collection.drop(() => {
                  Review.ensureIndexes(() => {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

describe('Populating the databases', () => {
  it('Inserting data in the database ', (done) => {
    new Business(businesses[6])
      .save()
      .then((business) => {
        Branch.insertMany(branches, (err, data) => {
          Review.insertMany(reviews, (error, rev) => {
            businessID = business._id;
            branchID = data[0]._id;
            done();
          });
        });
      });
  });

  it('Inserting data in the database ', (done) => {
    services[0]._business = businessID;
    services[0].branches = [branchID];
    new Service(services[0])
      .save()
      .then(() => {
        done();
      }).catch(e => done(e));
  });
});


describe('View Services Tests', () => {
  let req;

  beforeEach(() => {
    req = supertest(app);
  });

  it('it should GET a Service by the given id', (done) => {
    Service.findOne({
      name: 'Service1',
    })
      .exec()
      .then((newService) => {
        const route = '/api/v1/service/'.concat(newService.id);
        req.get(route)
          .send(newService)
          .end((err, res) => {
            chai.expect(res.body)
              .to.have.property('name');
            chai.expect(res.body)
              .to.have.property('shortDescription');
            chai.expect(res.body)
              .to.have.property('description');
            chai.expect(res.body)
              .to.have.property('branches');
            chai.expect(res.body)
              .to.have.property('businessWorkingHours');
            chai.expect(res.body)
              .to.have.property('offerings');
            chai.expect(res.body)
              .to.have.property('reviews');
            done();
          });
      })
      .catch(done);
  });


  it('it should not GET a Service by the non existence id', (done) => {
    const route = '/api/v1/service/'.concat(4);
    req.get(route)
      .end((err, res) => {
        chai.expect(res.body)
          .to.have.property('errors')
          .to.equal('The specified service was not found.');
        done();
      });
  });
});
