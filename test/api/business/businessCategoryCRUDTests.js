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
  let x = 0;
  beforeEach((done) => {
    x += 1;
    console.log(x);
    Category.collection.drop(() => {
      Category.ensureIndexes(done);
    });
  });

  it('should add a category and return a confirmation message: Category added succesfully!', (done) => {
    req = supertest(app)
      .post('/api/v1/admin/Category/addCategory')
      .field('type', 'Business')
      .field('title', 'Sample Title')
      .attach('icon', '/home/youssef/git-rekt-se/app/public/abc.jpg')
      .end((err2, res) => {
        //  console.log(res.body);
        if (err2) {
          done(err2);
        } else {
          console.log('kojak');
          chai.expect(res.body.message)
            .to.equal('Category added succesfully!');
          done();
        }
      });
  });

  it('should not add a category and return an error message about type', (done) => {
    req = supertest(app)
      .post('/api/v1/admin/Category/addCategory')
      .field('type', 'bla')
      .field('title', 'Sample Title')
      .attach('icon', '/home/youssef/git-rekt-se/app/public/abc.jpg')
      // .expect(400)
      .end((err2, res2) => {
        // console.log(res2.body);
        if (err2) {
          done(err2);
          console.log('error caught..');
        } else {
          //  console.log(res2.error);
          // console.log('error not found');
          console.log(res2.body.error);
          chai.expect(res2.body.error)
            .to.equal('ValidationError: `bla` is not a valid enum value for path `type`.');
          done();
        }
      });
  });
  it('should edit a category and return a confirmation message', (done) => {
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
          .post(`/api/v1/admin/category/editCategory/${newcat._id}`)
          .field('type', 'Business')
          .field('title', '3ala2')
          .attach('icon', '/home/youssef/git-rekt-se/app/public/abc.jpg')
          .end((err2, res) => {
            // console.log(res.body);
            if (err2) {
              done(err2);
            } else {
              // console.log(3);
              const chaiCategory = Category.find(element => `${element._id}` === `${newcat._id}`);
              chai.expect(chaiCategory.title)
                .to.equal('3ala2');
              done();
            }
          });
      }
    });
  });
});
