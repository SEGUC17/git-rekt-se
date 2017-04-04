const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Review = require('../../../app/models/service/Review');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');
const services = require('../../../app/seed/service/serviceSeed');
const businessees = require('../../../app/seed/business/businessSeed');
const branches = require('../../../app/seed/service/branchesSeed');
const reviews = require('../../../app/seed/service/reviewSeed');

require('dotenv')
  .config();

describe('View Services Tests', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Service.collection.drop(() => {
          Service.ensureIndexes(() => {
            Offering.collection.drop(() => {
              Offering.ensureIndexes(() => {
                Branch.collection.drop(() => {
                  Branch.ensureIndexes(() => {
                    Business.insertMany((businessees), () => {
                      Business.findOne({ name: 'hobala1' }).exec()
                      .then((business) => {
                        Branch.insertMany(branches, () => {
                          Branch.findOne({ location: 'Nasr City' }).exec()
                          .then((branch) => {
                            Review.insertMany(reviews, () => {
                              services[0].business = business;
                              services[0].branch = branch;
                              Service.insertMany(services, (err) => {
                                if (err) {
                                  done(err);
                                } else {
                                  done();
                                }
                              });
                            });
                          }).catch(e => done(e));
                        });
                      }).catch(e => done(e));
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

  beforeEach(() => {
    req = supertest(app);
  });

  it('it should GET a Service by the given id', (done) => {
    Service.findOne({ name: 'Service1' }).exec()
    .then((newService) => {
      const route = '/api/v1/service/'.concat(newService.id);
      req.get(route)
        .send(newService)
        .end((err, res) => {
          chai.expect(res.body).to.have.property('name');
          chai.expect(res.body).to.have.property(('shortDescription'));
          chai.expect(res.body).to.have.property(('description'));
          chai.expect(res.body).to.have.property(('branches'));
          chai.expect(res.body).to.have.property(('workingHours'));
          chai.expect(res.body).to.have.property(('offerings'));
          chai.expect(res.body).to.have.property(('reviews'));
          done();
        });
    });
  });


  it('it should not GET a Service by the non existence id', (done) => {
    const route = '/api/v1/service/'.concat(4);
    req.get(route)
      .end((err, res) => {
        chai.expect(res.body).to.have.property('message').to.equal('The specified service was not found.');
        done();
      });
  });
});
