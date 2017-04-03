/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Category = require('../../../app/models/service/Category');

/**
 * Test Suite
 */

describe('Descriptive Test Suite', () => {
  let req;

  before(() => {
    console.log('I run before the first it block.');
  });

  beforeEach((done) => {
    Category.collection.drop(() => {
      Category.ensureIndexes(done);
    });
  });

  it('should add a category and return a confirmation message: Category added succesfully!', (done) => {
    const newCategory = ({
      type: 'Business',
      title: 'Sample Title',
      icon: 'sampleImagePath',
    });
    req = supertest(app)
      .post('/api/v1/admin/Category/addCategory');
    req.send(newCategory)
      .end((err2, res) => {
        if (err2) {
          done(err2);
        } else {
          chai.expect(res.body.message)
            .to.equal('Category added succesfully!');
          done();
        }
      });

    /**
     * Error happend with request, fail the test
     * with the error message.
     */

    /**
     * Do something with the response
     */

    //  const doSomethingMeaningFul = res.body.message === 'Working' ? 1 : 0;

    //  chai.expect(doSomethingMeaningFul)
    //    .to.equal(1);

    //  return done();
  });

  it('should not add a category and return an error message about type', (done) => {
    const newCategory = ({
      type: 'bla',
      title: 'Sample Title',
    });
    req = supertest(app)
      .post('/api/v1/admin/Category/addCategory');
    req.send(newCategory)
      .end((err2, res2) => {
        if (err2) {
          done(err2);
        } else {
          chai.expect(res2.body.message)
            .to.equal('Invalid category type!');
          done();
        }
      });
  });
  /**
   * Passing test
   */

  //   it('should do something modular, meaningful and pass', (done) => {
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
  //           .to.equal(0);

  //         return done();
  //       });
  //   });
});
