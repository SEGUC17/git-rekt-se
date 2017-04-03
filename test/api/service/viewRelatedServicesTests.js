/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');

const Business = require('../../../app/models/business/Business');
const Service = require('../../../app/models/service/Service');
const Category = require('../../../app/models/service/Category');

const businesses = require('../../../app/seed/business/verifiedBusinessSeed');
const services = require('../../../app/seed/service/serviceSeed');
const categories = require('../../../app/seed/service/serviceCatgeoriesSeed');

const Strings = require('../../../app/services/shared/Strings');

const categoriesIDs = [];
const businessesIDs = [];

/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * Dropping Database collections Suite
 */

describe('Dropping the Database Collections', () => {
  it('should drop the database collections', (done) => {
    Service.collection.drop(() => {
      Service.ensureIndexes(() => {
        Business.collection.drop(() => {
          Business.ensureIndexes(() => {
            Category.collection.drop(() => {
              Category.ensureIndexes(() => {
                done();
              });
            });
          });
        });
      });
    });
  });
});

/**
 * Populating Category collection with categoriesSeed and saving their IDs in categories array
 */

describe('Populating Category Collection', () => {
  it('should enter categories in the Category collection', (done) => {
    Category.insertMany(categories)
      .then((docs) => {
        categoriesIDs.push(docs[0]._id);
        categoriesIDs.push(docs[2]._id);
        categoriesIDs.push(docs[1]._id);
        done();
      })
      .catch(e => done([e]));
  });
});

/**
 * Populating business collection with businessSeed and saving their IDs in businesses array
 */

describe('Populating Business Collection', () => {
  it('should enter businesses in the Business collection', (done) => {
    Business.insertMany(businesses)
      .then((docs) => {
        businessesIDs.push(docs[1]._id);
        businessesIDs.push(docs[2]._id);
        done();
      })
      .catch(e => done([e]));
  });
});

/**
 * Populating Service collection with categoriesIDs & businessesIDs
 */

describe('Populating Service Collection', () => {
  it('should enter services in the service collection', (done) => {
    services[0].categories = [categoriesIDs[1]];
    services[0]._business = businessesIDs[0];

    services[1].categories = [categoriesIDs[1], categoriesIDs[0]];
    services[1]._business = businessesIDs[1];

    services[2].categories = [categoriesIDs[0]];
    services[2]._business = businessesIDs[1];

    Service.insertMany(services).then((docs) => {
      done();
    }).catch(e => done([e]));
  });
});

/**
 * View Related Services Suite
 */

describe('Client Signup API', () => {
  let req;

  /**
   * Passing Test1: returning services of the same categories and same offering business
   */
  it('should return the services of the same category from the same businesses', (done) => {
    req = supertest(app)
      .get(`/api/v1/service/category/${categoriesIDs[0]}/1`);
    req
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
        /**
         * Checking the content of the response
         */
        chai.expect(res.body.count)
          .to.equal(2);
        chai.expect(res.body.results)
          .to.have.lengthOf(2);

        chai.expect(res.body.results[0]._business.name)
          .to.equal('GUC language center');
        chai.expect(res.body.results[0].name)
          .to.equal('GUC english course');

        chai.expect(res.body.results[1]._business.name)
          .to.equal('GUC language center');
        chai.expect(res.body.results[1].name)
          .to.equal('GUC german course');

        done();
      });
  });

  /**
   * Passing Test2: returning services of the same categories and differnet offering business
   */

  it('should return the services of the same category from different businesses', (done) => {
    req = supertest(app)
      .get(`/api/v1/service/category/${categoriesIDs[1]}/1`);
    req
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
        /**
         * Checking the content of the response
         */

        chai.expect(res.body.count)
          .to.equal(2);
        chai.expect(res.body.results)
          .to.have.lengthOf(2);

        chai.expect(res.body.results[0]._business.name)
          .to.equal('Not Courses');
        chai.expect(res.body.results[0].name)
          .to.equal('Not Courses English Language Course');

        chai.expect(res.body.results[1]._business.name)
          .to.equal('GUC language center');
        chai.expect(res.body.results[1].name)
          .to.equal('GUC english course');

        done();
      });
  });

  /**
   * Failing Test: No related services in the category requested
   */

  it('should return no related businesses in a requested category', (done) => {
    req = supertest(app)
      .get(`/api/v1/service/category/${categoriesIDs[2]}/1`);
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.visitorErrors.NoRelatedServices],
      }, done);
  });
});
