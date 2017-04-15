/**
 * API Testing Template
 */

const chai = require('chai');
const path = require('path');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const Admin = require('../../../app/models/admin/Admin');
const clients = require('../../../app/seed/client/clientSeed');
const Strings = require('../../../app/services/shared/Strings.js');

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
    Client.collection.drop(() => {
      Client.ensureIndexes(done);
    });
  });
  it('Delete a client and return a confirmation message', (done) => {
    const client1 = clients[0];
    new Client(client1)
      .save()
      .then((client2) => {
        req = supertest(app)
          .post(`/api/v1/admin/client/delete/${client2._id}`)
          .expect('Content-Type', /json/)
          .set('Authorization', `JWT ${token}`)
          .send()
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Client.count((err3, c) => {
                if (err3) {
                  done(err3);
                } else {
                  chai.expect(c)
                    .to.equal(1);
                }
              });
              chai.expect(res.body.message)
                .to.equal(Strings.adminSuccess.clientDeleted);
              done();
            }
          });
      })
      .catch(done);
  });

  it('should not delete a client and return an error message', (done) => {
    req = supertest(app)
      .post('/api/v1/admin/client/delete/4')
      .set('Authorization', `JWT ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(400, {
        errors: [{
          param: 'id',
          msg: 'Invalid Client ID',
          value: '4',
        }],
      }, done);
  });
  after((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(done);
    });
  });
});
