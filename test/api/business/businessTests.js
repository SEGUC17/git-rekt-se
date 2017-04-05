const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');

const locations = require('../../../app/seed/service/locations');
const Branch = require('../../../app/models/service/Branch');
const Category = require('../../../app/models/service/Category');
const Business = require('../../../app/models/business/Business');
const businessSeed = require('../../../app/seed/business/businessSeed');
const businessMessages = require('../../../app/services/shared/Strings')
  .businessMessages;
const businessSuccess = require('../../../app/services/shared/Strings')
  .businessSuccess;

const businessData = {
  name: businessSeed[0].name,
  email: businessSeed[0].email,
  password: businessSeed[0].password,
  shortDescription: businessSeed[0].shortDescription,
  phoneNumbers: businessSeed[0].phoneNumbers,
  _status: 'verified',
};

const businessLogin = {
  email: businessData.email,
  password: businessData.password,
};

/**
 * Authenticated Business Test Suite
 */

/**
 * Authenticated Business Edit Info Test Suite
 */
describe('Should Edit Info Correctly', () => {
  let req;
  let businessID;
  let categoryID;
  let searchID;
  let token;
  const categoryData = {
    type: 'Business',
    title: 'Test',
  };

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes((err) => {
        if (err) {
          done(err);
        } else {
          Category.collection.drop(() => {
            Category.ensureIndexes((categoryErr) => {
              if (categoryErr) {
                done(categoryErr);
              } else {
                new Category(categoryData)
                  .save()
                  .then((category) => {
                    categoryID = category._id;
                    new Business(businessData)
                      .save()
                      .then((business) => {
                        businessID = business._id;
                        searchID = {
                          _id: businessID,
                        };
                        req = supertest(app)
                          .post('/api/v1/business/auth/verified/login')
                          .send(businessLogin)
                          .end((postErr, res) => {
                            if (postErr) {
                              done(postErr);
                            } else {
                              token = res.body.token;
                              done();
                            }
                          });
                      })
                      .catch(done);
                  })
                  .catch(done);
              }
            });
          });
        }
      });
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .put(`/api/v1/business/edit/${businessID}`);
  });

  it('should edit info correctly', (done) => {
    const editInfo = {
      workingHours: 'Not Open!',
      categories: [categoryID],
      description: 'Test Description',
    };
    // console.log(editInfo);
    req.send(editInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200, {
        message: businessSuccess.infoEditSuccess,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne(searchID)
            .exec()
            .then((business) => {
              chai.expect(business.workingHours)
                .to.equal(editInfo.workingHours);
              chai.expect(business.categories.length)
                .to.equal(1);
              chai.expect(business.categories[0])
                .to.satisfy(category => category.equals(editInfo.categories[0]));
              chai.expect(business.description)
                .to.equal(editInfo.description);
              done();
            })
            .catch(done);
        }
      });
  });

  it('should edit info correctly again', (done) => {
    const editInfo = {
      workingHours: 'Now Open!',
      categories: [categoryID],
      description: 'Test Description 2',
    };
    req.send(editInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200, {
        message: businessSuccess.infoEditSuccess,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne(searchID)
            .exec()
            .then((business) => {
              chai.expect(business.workingHours)
                .to.equal(editInfo.workingHours);
              chai.expect(business.categories.length)
                .to.equal(1);
              chai.expect(business.categories[0])
                .to.satisfy(category => category.equals(editInfo.categories[0]));
              chai.expect(business.description)
                .to.equal(editInfo.description);
              done();
            })
            .catch(done);
        }
      });
  });

  it('should edit info correctly when there are duplicate categories', (done) => {
    const editInfo = {
      workingHours: 'Now Open 1 2 3!',
      categories: [categoryID, categoryID],
      description: 'This is a new description',
    };
    req.send(editInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200, {
        message: businessSuccess.infoEditSuccess,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Business.findOne(searchID)
            .exec()
            .then((business) => {
              chai.expect(business.workingHours)
                .to.equal(editInfo.workingHours);
              chai.expect(business.categories.length)
                .to.equal(1);
              chai.expect(business.categories[0])
                .to.satisfy(category => category.equals(editInfo.categories[0]));
              chai.expect(business.description)
                .to.equal(editInfo.description);
              done();
            })
            .catch(done);
        }
      });
  });

  it('should not allow all data to be empty', (done) => {
    req.send({})
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          chai.expect(res.body)
            .to.have.property('errors');
          chai.expect(res.body.errors.length)
            .to.equal(3);
          done();
        }
      });
  });

  it('should not allow un-authenticated business from editing', (done) => {
    const editInfo = {
      description: 'This is a new description',
    };
    req.send(editInfo)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should not allow a logged in business from editing another business', (done) => {
    const editInfo = {
      description: 'This is a new description',
    };
    req = supertest(app)
      .put('/api/v1/business/edit/222');
    req.send(editInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [businessMessages.mismatchID],
      }, done);
  });
});

/**
 * Authenticated Business CRUD Branches Test Suite
 */
describe('Should ADD/EDIT/DELETE Branches', () => {
  let token;
  let req;
  let businessID;
  let branchID;
  const branchInfo = {
    branches: [{
      location: locations[0],
      address: '16th Avenue',
    }],
  };

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Branch.collection.drop(() => {
          Branch.ensureIndexes(() => {
            new Business(businessData)
              .save()
              .then((business) => {
                // Business won't have the branch
                businessID = business._id;
                const branchData = {
                  _business: businessID,
                  location: locations[0],
                  address: 'Address Here',
                };
                new Branch(branchData)
                  .save()
                  .then((branch) => {
                    branchID = branch._id;
                    req = supertest(app)
                      .post('/api/v1/business/auth/verified/login')
                      .send(businessLogin)
                      .end((postErr, res) => {
                        if (postErr) {
                          done(postErr);
                        } else {
                          token = res.body.token;
                          done();
                        }
                      });
                  })
                  .catch(done);
              })
              .catch(done);
          });
        });
      });
    });
  });

  it('should add branches correctly', (done) => {
    const searchBusinessID = {
      _id: businessID,
    };
    req = supertest(app)
      .post(`/api/v1/business/${businessID}/add/branches`);
    req.send(branchInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          chai.expect(res.body)
            .to.have.property('message');
          chai.expect(res.body.message)
            .to.equal(businessSuccess.branchAddedSuccess);
          Business.findOne(searchBusinessID)
            .populate('branches')
            .exec()
            .then((business) => {
              chai.expect(business)
                .to.have.property('branches');
              chai.expect(business.branches.length)
                .to.equal(1);
              chai.expect(business.branches[0])
                .to.have.property('location');
              chai.expect(business.branches[0])
                .to.have.property('address');
              chai.expect(business.branches[0].location)
                .to.equal(branchInfo.branches[0].location);
              chai.expect(business.branches[0].address)
                .to.equal(branchInfo.branches[0].address);
              done();
            })
            .catch(done);
        }
      });
  });

  it('should return an error when request is empty', (done) => {
    req = supertest(app)
      .post(`/api/v1/business/${businessID}/add/branches`);
    req.send({})
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          chai.expect(res.body)
            .to.have.property('errors');
          chai.expect(res.body.errors.length)
            .to.equal(1);
          done();
        }
      });
  });

  it('should edit a branch correctly', (done) => {
    req = supertest(app)
      .put(`/api/v1/business/${businessID}/edit/branch/${branchID}`);
    const newBranchData = {
      branch: {
        location: locations[2],
        address: 'Mostafa El Na7as',
      },
    };
    const searchBranchID = {
      _id: branchID,
    };
    req.send(newBranchData)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          chai.expect(res.body)
            .to.have.property('message');
          chai.expect(res.body.message)
            .to.equal(businessSuccess.branchEditSuccess);
          Branch.findOne(searchBranchID)
            .exec()
            .then((branch) => {
              chai.expect(branch)
                .to.have.property('location');
              chai.expect(branch)
                .to.have.property('address');
              chai.expect(branch.location)
                .to.equal(newBranchData.branch.location);
              chai.expect(branch.address)
                .to.equal(newBranchData.branch.address);
              done();
            })
            .catch(done);
        }
      });
  });

  it('should also return an error when request is empty', (done) => {
    req = supertest(app)
      .put(`/api/v1/business/${businessID}/edit/branch/${branchID}`);
    req.send({})
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          chai.expect(res.body)
            .to.have.property('errors');
          chai.expect(res.body.errors.length)
            .to.equal(3);
          done();
        }
      });
  });

  it('should delete a branch correctly', (done) => {
    req = supertest(app)
      .delete(`/api/v1/business/${businessID}/delete/branch/${branchID}`);
    const searchBranchID = {
      _id: branchID,
    };
    req.set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Branch.findOne(searchBranchID)
            .exec()
            .then((branch) => {
              chai.expect(branch)
                .to.have.property('_deleted');
              chai.expect(branch._deleted)
                .to.equal(true);
              done();
            })
            .catch(done);
        }
      });
  });

  it('should not allow un-authenticated business from adding branches', (done) => {
    req = supertest(app)
      .post(`/api/v1/business/${businessID}/add/branches`);
    req.send(branchInfo)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should not allow a logged in business from adding branches to another business', (done) => {
    req = supertest(app)
      .post('/api/v1/business/222/add/branches');
    req.send(branchInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [businessMessages.mismatchID],
      }, done);
  });
});
