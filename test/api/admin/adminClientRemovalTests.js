/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const Admin = require('../../../app/models/admin/Admin');
const clients = require('../../../app/seed/client/clientSeed');
const Strings = require('../../../app/services/shared/Strings.js');

/**
 * Test Suite
 */

describe('Client Removal Test Suite', () => {
  let req;
  let sampleAdmin;
  let token;
  let removedUserID;

  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(() => {
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
              .catch(e => done(e));
          });
        });
      });
    });
  });

  /**
   * Passing Test 1: It should delete a client with the specified id
   */

  it('should delete a client and return a confirmation message', (done) => {
    const client1 = clients[1];
    new Client(client1)
      .save()
      .then((client2) => {
        removedUserID = client2._id;
        req = supertest(app)
          .get(`/api/v1/admin/client/delete/${client2._id}`)
          .expect('Content-Type', /json/)
          .set('Authorization', `JWT ${token}`)
          .send()
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              chai.expect(client2._deleted);
              chai.expect(res.body.message)
                .to.equal(Strings.adminSuccess.clientDeleted);
              done();
            }
          });
      })
      .catch(done);
  });

  /**
   * Failing Test 1: It should throw an error whenever deleting a deleted user
   */
  it('should return an error message when deleting a deleted user', (done) => {
    req = supertest(app)
      .get(`/api/v1/admin/client/delete/${removedUserID}`)
      .set('Authorization', `JWT ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [Strings.adminFailures.clientAlreadyDeleted],
      }, done());
  });

  /**
   * Failing Test 2: It should throw Invalid id error whenever deleting a client not confirmed yet
   */

  it('should return an error message when id of a client not confirmed yet is passed', (done) => {
    const client1 = clients[0];
    new Client(client1)
      .save()
      .then((client2) => {
        req = supertest(app)
          .get(`/api/v1/admin/client/delete/${client2._id}`)
          .set('Authorization', `JWT ${token}`)
          .send()
          .expect('Content-Type', /json/)
          .expect(400, {
            errors: [Strings.adminValidationErrors.invalidClientID],
          }, done());
      })
      .catch(e => done(e));
  });

  /**
   * Failing Test 3: It should throw Invalid id error whenever
   * deleting a client with an invalid monogo id
   */

  it('should return an error message when invalid id is passed', (done) => {
    req = supertest(app)
      .get('/api/v1/admin/client/delete/4')
      .set('Authorization', `JWT ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        chai.expect(res.body.errors[0].msg)
          .to.equal(Strings.adminValidationErrors.invalidClientID);
        done();
      });
  });

  after((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(done);
    });
  });
});
