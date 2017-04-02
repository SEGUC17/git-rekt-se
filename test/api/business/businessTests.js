const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');

const Category = require('../../../app/models/service/Category');
const Business = require('../../../app/models/business/Business');
const businessSeed = require('../../../app/seed/business/businessSeed');
const businessMessages = require('../../../app/services/shared/Strings')
  .businessMessages;

/**
 * Authenticated Business Test Suite
 */

describe('Should Edit Info Correctly', () => {
  let req;
  let id;
  let searchID;
  let token;

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

  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes((err) => {
        if (err) {
          done(err);
        }
        Category.collection.drop(() => {
          Category.ensureIndexes((categoryErr) => {
            if (categoryErr) {
              done(categoryErr);
            } else {
              new Business(businessData)
                .save()
                .then((business) => {
                  id = business._id;
                  searchID = {
                    _id: id,
                  };
                  req = supertest(app)
                    .post('/api/v1/business/auth/verified/login')
                    .send(businessLogin)
                    .end((postErr, res) => {
                      if (err) {
                        done(err);
                      } else {
                        token = res.body.token;
                        done();
                      }
                    });
                })
                .catch(done);
            }
          });
        });
      });
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .put(`/api/v1/business/edit/${id}`);
  });

  it('should edit working hours correctly', (done) => {
    const editInfo = {
      workingHours: 'Not Open!',
    };
    req.send(editInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200, {
        message: businessMessages.editSuccess,
      })
      .end((err, res) => {
        Business.findOne(searchID)
          .exec()
          .then((business) => {
            chai.expect(business.workingHours)
              .to.equal(editInfo.workingHours);
            done();
          })
          .catch(done);
      });
  });

  it('should edit categories correctly', (done) => {
    const editInfo = {
      categories: ['Machine Learning', 'Big Data'],
    };
    req.send(editInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200, {
        message: businessMessages.editSuccess,
      })
      .end((err, res) => {
        Business.findOne(searchID)
          .exec()
          .then((business) => {
            chai.expect(business.categories.length)
              .to.equal(2);
            done();
          })
          .catch(done);
      });
  });

  it('should edit description correctly', (done) => {
    const editInfo = {
      description: 'This is a new description',
    };
    req.send(editInfo)
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(200, {
        message: businessMessages.editSuccess,
      })
      .end((err, res) => {
        Business.findOne(searchID)
          .exec()
          .then((business) => {
            chai.expect(business.description)
              .to.equal(editInfo.description);
            done();
          })
          .catch(done);
      });
  });

  it('should not allow all data to be empty', (done) => {
    req.send({})
      .set('Authorization', `JWT ${token}`)
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [businessMessages.allFieldsEmpty],
      }, done);
  });

  it('should not allow un-authenticated business from editing', (done) => {
    const editInfo = {
      description: 'This is a new description',
    };
    req.send(editInfo)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});
