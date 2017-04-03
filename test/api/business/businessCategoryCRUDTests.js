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

describe('Category CRUD Test Suite', () => {
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
      .post('/api/v1/admin/Category/addCategory')
      .field('type', 'Business')
      .field('title', 'Sample Title')
      .attach('icon', '/home/youssef/git-rekt-se/app/public/abc.jpg')
      .end((err2, res) => {
        console.log(res.body);
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
  it('shouldedit a category and return a confirmation message', (done) => {
    const newCategory = new Category({
      type: 'Business',
      title: 'Sample Title',
      icon: 'sampleimagePath',
    });
    newCategory.save((err, newcat) => {
      if (err) {
        console.log(err);
      } else {
        req = supertest(app)
          .post(`/api/v1/admin/category/addCategory/${newCategory._id}`);
        req.send({
            type: 'Business',
            title: '3ala2',
            icon: 'sampleimagePath',
          })
          .end((err2, res) => {
            if (err2) {
              done(err2);
            } else {
              console.log(3);
              const chaiCategory = Category.find(element => `${element._id}` === `${newCategory._id}`);
              chai.expect(chaiCategory.title)
                .to.equal('3ala2');
              done();
            }
          });
      }
    });
  });
});
