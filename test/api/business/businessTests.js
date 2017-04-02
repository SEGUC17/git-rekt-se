const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const businessSeed = require('../../../app/seed/business/unverifiedBusinessSeed');

/**
 * Authenticated Business Test Suite
 */

describe('Should Edit Info Correctly', () => {
  let req;
  let id;
  const editInfo = {
    workingHours: 'Not Open!',
  };

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
        } else {
          new Business(businessData)
            .save()
            .then(done)
            .catch(done);
        }
      });
    });
  });

  beforeEach((done) => {
    req = supertest(app)
      .put(`/api/v1/business/${id}/edit`);
  });

  it('should edit info correctly', (done) => {
    req.send(editInfo)
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'Edited Successfully',
      }, done);
  });

  //TODO Edit test to check on body
  it('should not allow all data to be empty', (done) => {
    req.send({})
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});
