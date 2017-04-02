const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');

const Category = require('../../../app/models/service/Category');
const Business = require('../../../app/models/business/Business');
const businessSeed = require('../../../app/seed/business/unverifiedBusinessSeed');
const businessMessages = require('../../../app/services/shared/Strings')
  .businessMessages;

/**
 * Authenticated Business Test Suite
 */

describe('Should Edit Info Correctly', () => {
  let req;
  let id;
  let searchID;

  const businessData = {
    name: businessSeed[0].name,
    email: businessSeed[0].email,
    shortDescription: businessSeed[0].shortDescription,
    phoneNumbers: [businessSeed[0].mobile],
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
                  done();
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
      .put(`/api/v1/business/${id}/edit`);
  });

  it('should edit working hours correctly', (done) => {
    const editInfo = {
      workingHours: 'Not Open!',
    };
    req.send(editInfo)
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

  // TODO Edit test to check on body
  it('should not allow all data to be empty', (done) => {
    req.send({})
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [businessMessages.allFieldsEmpty],
      }, done);
  });
});
