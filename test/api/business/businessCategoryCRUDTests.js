/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Category = require('../../../app/models/service/Category');
const Admin = require('../../../app/models/admin/Admin');

/**
 * Test Suite
 */

describe('Category CRUD Test Suite', () => {
  let req;
  let sampleAdmin;
  let token;

  before((done) => {
    console.log('I create a dummy admin and login.');
    console.log('I also drop the category collection before each test.');
    sampleAdmin = new Admin({
      email: 'abdobassiony996@hotmail.com',
      password: 'Strong#1234',
    });
    Admin.collection.drop(() => {
      Admin.ensureIndexes(() => {
        new Admin(sampleAdmin)
          .save()
          .then(() => {
            req = supertest(app)
              .post('/api/v1/Admin/auth/login')
              .send({
                email: sampleAdmin.email,
                password: sampleAdmin.password,
              })
              .end((err, res) => {
                token = res.body.token;
                done();
              });
          })
          .catch(done);
      });
    });
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
      .set('Authorization', `JWT ${token}`)
      .end((err2, res) => {
        if (err2) {
          done(err2);
        } else {
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
      .set('Authorization', `JWT ${token}`)
      .expect(400)
      .end((err2, res2) => {
        if (err2) {
          done(err2);
        } else {
          chai.expect(res2.body.errors.message)
            .to.equal('Category validation failed');
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
          .set('Authorization', `JWT ${token}`)
          .end((err2, res) => {
            if (err2) {
              done(err2);
            } else {
              chai.expect(res.body.message)
                .to.equal('Category edited succesfully!');
              Category.findOne({
                _id: `${newcat._id}`,
              }, (err3, category) => {
                if (err3) {
                  done(err3);
                } else {
                  chai.expect(category.title)
                    .to.equal('3ala2');
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
          .field('type', 'bla')
          .field('title', '3ala2')
          .attach('icon', '/home/youssef/git-rekt-se/app/public/abc.jpg')
          .set('Authorization', `JWT ${token}`)
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
                  done(err3);
                } else {
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
          .set('Authorization', `JWT ${token}`)
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
                  done(err3);
                } else {
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
          .set('Authorization', `JWT ${token}`)
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
      .set('Authorization', `JWT ${token}`)
      .end((err2, res) => {
        if (err2) {
          done(err2);
        } else {
          chai.expect(res.body.errors.message)
            .to.equal('Cast to ObjectId failed for value "4" at path "_id" for model "Category"');
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
