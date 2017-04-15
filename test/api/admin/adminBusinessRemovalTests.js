const chai = require('chai');
const path = require('path');
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
  it('should delete a business and return a confirmation message: Business added succesfully!', (done) => {
    req = supertest(app)
      .post('/api/v1/admin/category/add')
      .field('type', 'Business')
      .field('title', 'Sample Title')
      .attach('icon', path.join(__dirname, '../../../public/dist/uploads/dummy/c1.jpg'))
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
});
