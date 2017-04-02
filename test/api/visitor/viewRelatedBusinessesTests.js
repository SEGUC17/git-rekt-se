/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');

const Business = require('../../../app/models/business/Business');
const Categories = require('../../../app/models/service/Category');

const categories = require('../../../app/seed/service/categoriesSeed');
const businesses = require('../../../app/seed/business/verifiedBusiness');

/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * View Related Business Suite
 */

/**
 * Testing the following:-
 * 1 businesses in the same category only appears,
 * 2 only the name and short description appears,
 * 3 no businesses in this category appears,
 */


describe('View Related Businesses API', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(done);
    });
    Categories.collection.drop(() => {
      Categories.ensureIndexes(done);
    });
  });

  /**
   * Inserting Business Categories and getting their object IDs
   */

  Categories.insertMany(categories, null, (done) => {
    done();
  });
  const category1Id = Categories.findOne({
    title: 'Language Courses',
  }, {
    returnKey: 1,
  }, (done) => {
    done();
  });

  const category2Id = Categories.findOne({
    title: 'Self-Managment Courses',
  }, {
    returnKey: 1,
  }, (done) => {
    done();
  });

  /**
   * Inserting Businesses after updating their categories
   */

  businesses[0].categories = [category2Id];
  businesses[1].categories = [category1Id];

  Business.insertMany(businesses, null, (done) => {
    done();
  });


  beforeEach(() => {
    req = supertest(app)
      .get('/api/v1/business/category/:id/:offset');
  });

  /**
   * Passing Test: Only businesses of the same category appears
   */

  it('should return only the businesses of the category requested', (done) => {
    const body = {
      offset: 1,
      category: category1Id,
    };
    req.sned(body)
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
        chai.expect(res.body.results[0].name).to.equal('Not Courses');
        done();
      });
  });

  /**
   * Failing Test: No related Businesses in the category requested
   */

  it('should return no related businesses in a requested category', (done) => {
    const category3Id = Categories.findOne({
      title: 'Team Management Courses',
    }, {
      returnKey: 1,
    }, (finddone) => {
      finddone();
    });

    const body = {
      offset: 1,
      category: category3Id,
    };
    req.sned(body)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: 'No related businesses',
      }, done);
  });
});
