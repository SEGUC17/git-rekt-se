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
          Category.findOne({
            title: 'Sample Title',
          }, (err3, category3) => {
            chai.expect(category3.type)
              .to.equal('Business');
          });
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
      .expect(400)
      .end((err2, res2) => {
        // console.log(res2.body);
        if (err2) {
          done(err2);
          console.log('error caught..');
        } else {
          //  console.log(res2.error);
          // console.log('error not found');
          // console.log(res2.body);
          chai.expect(res2.body.errors.message)
            .to.equal('Category validation failed');
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
        done(err);
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
              chai.expect(res.body.message)
                .to.equal('Category edited succesfully!'); // const chaiCategory = Category.findbyId(element => `${element._id}` === `${newcat._id}`);
              Category.findOne({
                _id: `${newcat._id}`,
              }, (err3, category) => {
                if (err3) {
                  //  console.log('errr', err3);
                  // return done(err, null);
                } else {
                  //  console.log(category);
                  //  console.log('yaaaaaaaaay');
                  chai.expect(category.title)
                    .to.equal('3ala2');
                  done();
                }
              });
              // console.log(chaiCategory);
            }
          });
      }
    });
  });
  it('should not edit a category and return an error message', (done) => {
    const newCategory = new Category({
      type: 'Business',
      title: 'Sample Title',
      icon: 'sampleimagePath',
    });
    newCategory.save((err, newcat) => {
      if (err) {
        done(err);
      } else {
        req = supertest(app)
          .post(`/api/v1/admin/category/editCategory/${newcat._id}`)
          .field('type', 'bla')
          .field('title', '3ala2')
          .attach('icon', '/home/youssef/git-rekt-se/app/public/abc.jpg')
          .end((err2, res) => {
            if (err2) {
              done(err2);
            } else {
              chai.expect(res.body.errors.message)
                .to.equal('Category validation failed');
              Category.findOne({
                _id: `${newcat._id}`,
              }, (err3, category) => {
                if (err3) {
                  //  console.log('errr', err3);
                  // return done(err, null);
                } else {
                  //  console.log(category);
                  //  console.log('yaaaaaaaaay');
                  chai.expect(category.type)
                    .to.equal('Business');
                  done();
                }
              });
            }
          });
      }
    });
  });
  it('should not edit a category and return an error message', (done) => {
    const newCategory = new Category({
      type: 'Business',
      title: 'Sample Title',
      icon: 'sampleimagePath',
    });
    newCategory.save((err, newcat) => {
      if (err) {
        done(err);
      } else {
        req = supertest(app)
          .post(`/api/v1/admin/category/editCategory/${newcat._id}`)
          .field('type', 'Business')
          .attach('icon', '/home/youssef/git-rekt-se/app/public/abc.jpg')
          .end((err2, res) => {
            if (err2) {
              done(err2);
            } else {
              chai.expect(res.body.errors.message)
                .to.equal('Category validation failed');
              Category.findOne({
                _id: `${newcat._id}`,
              }, (err3, category) => {
                if (err3) {
                  //  console.log('errr', err3);
                  // return done(err, null);
                } else {
                  //  console.log(category);
                  //  console.log('yaaaaaaaaay');
                  chai.expect(category.title)
                    .to.equal('Sample Title');
                  done();
                }
              });
            }
          });
      }
    });
  });
  it('should delete a category and return a confirmation message', (done) => {
    const newCategory = new Category({
      type: 'Business',
      title: 'Sample Title',
      icon: 'sampleimagePath',
    });
    newCategory.save((err, newcat) => {
      if (err) {
        done(err);
      } else {
        req = supertest(app)
          .post(`/api/v1/admin/category/deleteCategory/${newcat._id}`)
          .end((err2, res) => {
            if (err2) {
              done(err2);
            } else {
              chai.expect(res.body.message)
                .to.equal('Category deleted succesfully!');
              Category.count((err3, c) => {
                if (err3) {
                  done(err3);
                } else {
                  chai.expect(c)
                    .to.equal(0);
                  done();
                }
              });
            }
          });
      }
    });
  });
  it('should not delete a category and return an error message', (done) => {
    req = supertest(app)
      .post('/api/v1/admin/category/deleteCategory/4')
      .end((err2, res) => {
        if (err2) {
          done(err2);
        } else {
          chai.expect(res.body.errors.message)
            .to.equal('Cast to ObjectId failed for value \"4\" at path \"_id\" for model \"Category\"');
          Category.count((err3, c) => {
            if (err3) {
              done(err3);
            } else {
              chai.expect(c)
                .to.equal(0);
              done();
            }
          });
        }
      });
  });
});
