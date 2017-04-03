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

const categories = require('../../../app/seed/service/categoriesSeed');
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
        Category.findOne({
          title: 'Language Courses',
        })
          .then((category1) => {
            Category.findOne({
              title: 'Self-Managment Courses',
            })
              .then((category2) => {
                Category.findOne({
                  title: 'Team Management Courses',
                })
                  .then((category3) => {
                    categoriesIDs.push(category1._id);
                    categoriesIDs.push(category2._id);
                    categoriesIDs.push(category3._id);
                    done();
                  }).catch(e => done([e]));
              }).catch(e => done([e]));
          }).catch(e => done([e]));
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
  console.log(categoriesIDs);

  /**
   * Passing Test: Only 2 businesses of the same category appears
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
   * Passing Test: Only 1 businesse of the same category appears
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
   * Failing Test: No related Businesses in the category requested
   */

  it('should return no related businesses in a requested category', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${categoriesIDs[2]}/1`);
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.visitorErrors.NoRelatedBusinesses],
      }, done);
  });
});
