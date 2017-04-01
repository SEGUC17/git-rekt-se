/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const businesses = require('../../../app/seed/business/business');
const Strings = require('../../../app/services/shared/Strings');
/**
 * Test Suite
 */

describe('Business forgot password API', () => {
  let req;

   before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        const data = businesses[0];
        const businessData = {
          name: data.name,
          email: data.email,
          description: data.description,
          phoneNumbers: data.phoneNumbers,
        };
        /* eslint-disable no-new */
        new Business(businessData)
          .save()
          .then(() => done())
          .catch(done);
      });
    });
});

  beforeEach(() => {
    console.log('I run before every it block');
    req = supertest(app)
      .post('/api/v1/business/auth/forgot');
  });

  //   /**
  //    * Failing Test
  //    */

  //   it('should do something modular, meaningful and fail', (done) => {
  //     req.expect(404)
  //       .end((err, res) => {
  //         /**
  //          * Error happend with request, fail the test
  //          * with the error message.
  //          */
  //         if (err) {
  //           return done(err);
  //         }

  //         /**
  //          * Do something with the response
  //          */

  //         const doSomethingMeaningFul = res.body.message === 'Working' ? 1 : 0;

  //         chai.expect(doSomethingMeaningFul)
  //           .to.equal(1);

  //         return done();
  //       });
  //   });


  /**
   * Passing test
   */

  it('should do something modular, meaningful and pass', (done) => {
    var mail1 = {
      "email": "hadyyasser23@gmail.com"
    };
    req.send(mail1)
      .expect('Content-Type', /json/)
      .expect(200)
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

        const doSomethingMeaningFul = res.body.message === Strings.CHECK_YOU_EMAIL ? 1 : 0;

        chai.expect(doSomethingMeaningFul)
          .to.equal(1);

        return done();
      });
  });
});