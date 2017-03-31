/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../app/app');

/**
 * Test Suite
 */

describe('Descriptive Test Suite', () => {
  let req;

  before(() => {
    console.log('I run before the first it block.');
  });

  beforeEach(() => {
    console.log('I run before every it block');
    req = supertest(app)
      .get('/api/v1/route_to_test');
  });

  /**
   * Failing Test
   */

  it('should do something modular, meaningful and fail', (done) => {
    req.expect(404)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */
        if (err) {
          return done(err);
        }

        /**
         * Do something with the response
         */

        const doSomethingMeaningFul = res.body.message === 'Working' ? 1 : 0;

        chai.expect(doSomethingMeaningFul)
          .to.equal(1);

        return done();
      });
  });


  /**
   * Passing test
   */

  it('should do something modular, meaningful and pass', (done) => {
    req.expect(404)
      .end((err, res) => {
        /**
         * Error happend with request, fail the test
         * with the error message.
         */
        if (err) {
          return done(err);
        }

        /**
         * Do something with the response
         */

        const doSomethingMeaningFul = res.body.message === 'Working' ? 1 : 0;

        chai.expect(doSomethingMeaningFul)
          .to.equal(0);

        return done();
      });
  });
});
