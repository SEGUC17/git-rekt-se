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

/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * View Related Business Suite
 */

describe('View Related Businesses API', () => {
  let req;
  let category1ID;
  let category2ID;
  let category3ID;

  /**
   * Inserting Business Categories and getting their object IDs
   */

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Category.collection.drop(() => {
          Category.ensureIndexes(() => {
            Category.insertMany(categories)
              .then((docs1) => {
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
                            category1ID = category1._id;
                            category2ID = category2._id;
                            category3ID = category3._id;
                            businesses[0].categories = [category2ID];
                            businesses[1].categories = [category1ID];
                            businesses[2].categories = [category1ID];

                            Business.insertMany(businesses)
                              .then((docs2) => {
                                done();
                              })
                              .catch(e => done([e]));
                          })
                          .catch(e => done([e]));
                      })
                      .catch(e => done([e]));
                  })
                  .catch(e => done([e]));
              })
              .catch(e => done([e]));
          });
        });
      });
    });
  });

  /**
   * Passing Test: Only 2 businesses of the same category appears
   */

  it('should return only the businesses of the category requested', (done) => {
    req = supertest(app)
      .get(`/api/v1/business/category/${category1ID}/1`);
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
      .get(`/api/v1/business/category/${category2ID}/1`);
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
      .get(`/api/v1/business/category/${category3ID}/1`);
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.visitorErrors.NoRelatedBusinesses],
      }, done);
  });
});
