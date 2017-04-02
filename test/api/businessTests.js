const chai = require('chai');
const supertest = require('supertest');
const app = require('../../app/app');
const Business = require('../../app/models/business/Business');
const Branch = require('../../app/models/service/Branch');
const Category = require('../../app/models/service/Category');


/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * View Business Suite
 */

describe('View Businesses Tests', () => {
  let req;

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes();
    });
    Category.collection.drop(() => {
      Category.ensureIndexes();
    });
    Branch.collection.drop(() => {
      Branch.ensureIndexes(done);
    });
  });

  beforeEach(() => {
    req = supertest(app);
  });

  it('it should GET a business by the given id', (done) => {
    const newBranch = new Branch({
      location: 'Nasr City',
      address: '123 nasr street',
    });

    newBranch.save((err, newbran) => {
      if (err) {
        console.log(err);
      }
    });

    const newCategory = new Category({
      type: 'Service',
      title: 'Nasr City',
    });

    newCategory.save((err, newcat) => {
      if (err) {
        console.log(err);
      }
    });

    const newBusiness = new Business({
      name: 'hobala26',
      email: 'test@gmail.com',
      shortDescription: 'This item is for testing the Business SignUp API',
      phoneNumbers: ['12345677', '22222222', '32414553'],
      password: 'blahblah1',
      confirmPassword: 'blahblah1',
      description: 'This is for testing the API',
      workingHours: 'Saturday To Thursday 8AM-5PM',
    });
    newBusiness.branches.push(newBranch.id);
    newBusiness.categories.push(newCategory.id);

    newBusiness.save((newBuss) => {
      const route = '/api/v1/business/'.concat(newBusiness.id);
      req.get(route)
        .send(newBusiness)
        .end((err, res) => {
          chai.expect(res.body).to.have.property('name');
          chai.expect(res.body).to.have.property(('email'));
          chai.expect(res.body).to.have.property(('shortDescription'));
          chai.expect(res.body).to.have.property(('description'));
          chai.expect(res.body).to.have.property(('workingHours'));
          chai.expect(res.body).to.have.property(('branches'));
          chai.expect(res.body).to.have.property(('categories'));
          done();
        });
    });
  });

  it('it should not GET a business by the non existence id', (done) => {
    const route = '/api/v1/business/'.concat(4);
    req.get(route)
      .end((err, res) => {
        chai.expect(res.body).to.have.property('errors');
        done();
      });
  });
});
