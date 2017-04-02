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

/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * View Related Services Suite
 */

describe('Client Signup API', () => {
  let req;
  let category1ID;
  let category2ID;
  let category3ID;

  /**
 * Dropping Category, Business, Service collections
 * populating database with some dummy values
 */

  before((done) => {
    Service.collection.drop(() => {
      Service.ensureIndexes(() => {
        Business.collection.drop(() => {
          Business.ensureIndexes(() => {
            Category.collection.drop(() => {
              Category.ensureIndexes(() => {
                Category.insertMany(categories, (inserterr1, docs1) => {
                  if (inserterr1) {
                    done(inserterr1);
                  }
                  Category.findOne({ title: 'Language Courses' }, (finderr1, category1) => {
                    if (finderr1) {
                      done(finderr1);
                    }
                    Category.findOne({ title: 'English Courses' }, (finderr2, category2) => {
                      if (finderr2) {
                        done(finderr2);
                      }
                      Category.findOne({ title: 'Principles of Self Management' }, (finderr3, category3) => {
                        if (finderr3) {
                          done(finderr3);
                        }
                        Business.insertMany(businesses, (inserterr2, docs2) => {
                          if (inserterr2) {
                            done(inserterr2);
                          }
                          Business.findOne({ name: 'Not Courses' }, (finderr4, business1) => {
                            if (finderr4) {
                              done(finderr4);
                            }
                            Business.findOne({ name: 'GUC language center' }, (finderr5, business2) => {
                              if (finderr5) {
                                done(finderr5);
                              }
                              category1ID = category1._id;
                              category2ID = category2._id;
                              category3ID = category3._id;

                              services[0].categories = [category2ID];
                              services[0]._business = [business1._id];

                              services[1].categories = [category2ID, category1ID];
                              services[1]._business = [business2._id];

                              services[2].categories = [category1ID];
                              services[2]._business = [business2._id];

                              Service.insertMany(services, (inserterr3, docs3) => {
                                if (inserterr3) {
                                  done(inserterr3);
                                }
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
          });
        });
      });
    });
  });

 /**
   * Passing Test1: returning services of the same categories and same offering business
   */
  it('should return the services of the same category from the same businesses', (done) => {
    req = supertest(app)
      .get(`/api/v1/service/category/${category1ID}/1`);
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
        console.log(res.body);
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
        chai.expect(res.body.results[0].name)
          .to.equal('GUC german course');

        done();
      });
  });

   /**
   * Passing Test2: returning services of the same categories and differnet offering business
   */

  it('should return the services of the same category from different businesses', (done) => {
    req = supertest(app)
      .get(`/api/v1/service/category/${category2ID}/1`);
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
        console.log(res.body);
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
        chai.expect(res.body.results[0].name)
          .to.equal('GUC english course');

        done();
      });
  });

/**
   * Failing Test: No related services in the category requested
   */

  it('should return no related businesses in a requested category', (done) => {
    req = supertest(app)
      .get(`/api/v1/service/category/${category3ID}/1`);
    req.expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.visitorErrors.NoRelatedservices],
      }, done);
  });
});
