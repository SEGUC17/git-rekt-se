/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app/app');

mongoose.Promise = Promise;

const Business = require('../../../app/models/business/Business');
const Category = require('../../../app/models/service/Category');

const categories = require('../../../app/seed/service/businessCategoriesSeed');
const businesses = require('../../../app/seed/business/verifiedBusinessSeed');

const Strings = require('../../../app/services/shared/Strings');

const categoriesIDs = [];

/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * Droping the Database Collections Suite
 */

describe('Dropping the Database Collections', () => {
  it('should drop the database collections', (done) => {
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

/**
 * Populating Category collection with categoriesSeed and saving their IDs in categories array
 */

describe('Populating Category Collection', () => {
  it('should enter categories in the Category collection', (done) => {
    Category.insertMany(categories)
      .then((docs) => {
        categoriesIDs.push(docs[0]._id);
        categoriesIDs.push(docs[1]._id);
        categoriesIDs.push(docs[2]._id);
        categoriesIDs.push(docs[3]._id);
        done();
      }).catch(e => done([e]));
  });
});

/**
 * Populating Business collection with categoriesIDs
 */

describe('Populating Business Collection', () => {
  it('should enter businesses in the business collection', (done) => {
    businesses[0].categories = [categoriesIDs[1]];
    businesses[1].categories = [categoriesIDs[0]];
    businesses[2].categories = [categoriesIDs[0]];
    businesses[3].categories = [categoriesIDs[0], categoriesIDs[3]];
    Business.insertMany(businesses).then((docs) => {
      done();
    }).catch(e => done([e]));
  });
});

/**
 * View Related Business Suite
 */

describe('View Related Businesses API', () => {
  let req;

  /**
   * Passing Test1: Only 2 businesses of the same category appears
   * The count is 2 also for ensuring that the deleted business will not appear in the results
   */

  it('should return only the businesses of the category requested', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${categoriesIDs[0]}/1`);
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
        chai.expect(res.body.results[0].name)
          .to.equal('Not Courses');
        chai.expect(res.body.results[1].name)
          .to.equal('GUC german center');
        done();
      });
  });

  /**
   * Passing Test2: Only 1 businesse of the same category appears
   */

  it('should return only the businesses of the category requested', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${categoriesIDs[1]}/1`);
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
          .to.equal(1);
        chai.expect(res.body.results)
          .to.have.lengthOf(1);
        chai.expect(res.body.results[0].name)
          .to.equal('Enhance');
        done();
      });
  });

  /**
   * Failing Test1: No related Businesses in the category requested
   */

  it('should return no related businesses in a requested category', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${categoriesIDs[2]}/1`);
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.visitorErrors.NoRelatedBusinesses],
      }, done);
  });

/**
   * Failing Test2: No related businesses in the category requested if they are deleted
   */

  it('should return no related businesses in a requested category if they are deleted', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${categoriesIDs[3]}/1`);
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.visitorErrors.NoRelatedBusinesses],
      }, done);
  });

  /**
   * Failing Test3: No results if the offset is more than the number of data
   */

  it('should return no related services in a requested category if the offset is too large', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${categoriesIDs[2]}/10`);
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.visitorErrors.NoRelatedBusinesses],
      }, done);
  });

  /**
   * Failing Test4: Invalid category id middleware handling check
   */

  it('should return invalid id message whenever requsting invalid id', (done) => {
    req = supertest(app)
      .get('/api/v1/business/category/10/1');
    req.expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body);
        chai.expect(res.body.errors[0].msg).to.equal(Strings.visitorValidationErrors.InvalidID);
        done();
      });
  });

   /**
   * Failing Test5: Invalid offset middleware handling check
   */

  it('should return invalid offset message whenever requsting invalid offset', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${categoriesIDs[2]}/0`);
    req.expect('Content-Type', /json/)
     .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body);
        chai.expect(res.body.errors[0].msg).to.equal(Strings.visitorValidationErrors.InvalidOffset);
        done();
      });
  });
});
