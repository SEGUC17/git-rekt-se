/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');

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
  let category1Id;
  let category2Id;
  let category3Id;
  let testID = 0;
  /**
   * Inserting Business Categories and getting their object IDs
   */

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Category.collection.drop(() => {
          Category.ensureIndexes(() => {
            Category.insertMany(categories, (inserterr1, docs1) => {
              if (inserterr1) {
                done(inserterr1);
              }
              Category.findOne({
                title: 'Language Courses',
              }, (finderr1, category1) => {
                if (finderr1) {
                  done(finderr1);
                }
                Category.findOne({
                  title: 'Self-Managment Courses',
                }, (finderr2, category2) => {
                  if (finderr2) {
                    done(finderr2);
                  }
                  /* eslint-disable no-underscore-dangle */
                  category1Id = category1._id;
                  category2Id = category2._id;
                  businesses[0].categories = [category2Id];
                  businesses[1].categories = [category1Id];
                  businesses[2].categories = [category1Id];


                  Business.insertMany(businesses, (inserterr2, docs2) => {
                    if (inserterr2) {
                      done(inserterr2);
                    }
                    Category.findOne({
                      title: 'Team Management Courses',
                    }, (finderr3, category3) => {
                      if (finderr3) {
                        done(finderr3);
                      }
                      category3Id = category3._id;
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


  beforeEach(() => {
    req = supertest(app)
      .get(`/api/v1/business/category/${testID === 0 ? category1Id : category3Id}/1`);
    testID += 1;
  });

  /**
   * Passing Test: Only businesses of the same category appears
   */

  it('should return only the businesses of the category requested', (done) => {
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
          .to.equal('Not Courses');
        done();
      });
  });

  /**
   * Failing Test: No related Businesses in the category requested
   */

  it('should return no related businesses in a requested category', (done) => {
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: Strings.visitorErrors.NoRelatedBusinesses,
      }, done);
  });
});
