const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Category = require('../../../app/models/service/Category');
const businesses = require('../../../app/seed/business/verifiedBusinessSeed');

require('dotenv')
  .config();

/**
 * View Business Suite
 */

describe('View Businesses Tests', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Category.collection.drop(() => {
          Category.ensureIndexes(() => {
            Branch.collection.drop(() => {
              Branch.ensureIndexes(() => {
                Business.insertMany(businesses, (err) => {
                  if (err) {
                    done(err);
                  } else {
                    done();
                  }
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

  it('it should GET a business by the given id', (done) => {
    Business.findOne(({ name: businesses[0].name })).exec()
    .then((business) => {
      const route = '/api/v1/business/'.concat(business.id);
      req.get(route)
        .send(business)
        .end((err, res) => {
          chai.expect(res.body).to.have.property('name');
          chai.expect(res.body).to.have.property(('email'));
          chai.expect(res.body).to.have.property(('shortDescription'));
          chai.expect(res.body).to.have.property(('categories'));
          chai.expect(res.body).to.have.property(('services'));
          chai.expect(res.body).to.have.property(('_id')).to.equal(business.id);
          done();
        });
    });
  });

  it('it should not GET a business by the non existence id', (done) => {
    const route = '/api/v1/business/'.concat(4);
    req.get(route)
      .end((err, res) => {
        chai.expect(res.body).to.have.property('errors');
        done();
      });
  });
});
