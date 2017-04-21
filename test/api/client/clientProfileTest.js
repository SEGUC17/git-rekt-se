const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const clients = require('../../../app/seed/client/clientSeed');

const modifiedMail = Object.assign({}, clients[1]);
modifiedMail.email = 'atherkhalid44@hotmail.com';

const notModifiedMail = Object.assign({}, clients[1]);
notModifiedMail.email = 'mohamedelzarei@gmail.com';


let token;

/**
 * Client Edit info Suite
 */

describe('Client Profile API', () => {
  let req;

  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(() => {
        Client.insertMany(clients[1])
                    .then(() => {
                      const newClient = Object.assign({}, clients[0]);
                      newClient.status = 'confirmed';

                      new Client(newClient)
                            .save()
                            .then(() => {
                              req = supertest(app)
                                    .post('/api/v1/client/auth/login')
                                    .send({
                                      email: clients[0].email,
                                      password: clients[0].password,
                                    })
                                    .expect('Content-Type', /json/)
                                    .expect(200)
                                    .end((err, res) => {
                                      if (err) {
                                        done(err);
                                      } else {
                                        token = res.body.token;
                                        done();
                                      }
                                    });
                            })
                            .catch(done);
                    })
                    .catch((err) => {
                      done(err);
                    });
      });
    });
  });

  beforeEach(() => {
    req = supertest(app);
  });

    /**
     * Client edit his info with editing his mail
     */

  it('Client could update his info with updating the email', (done) => {
    const client1 = clients[0];
    Client.findOne({
      email: client1.email,
    })
            .exec()
            .then((client) => {
              req.post('/api/v1/client/profile/'.concat(client._id)
                        .concat('/edit'))
                    .send(modifiedMail)
                    .set('Authorization', `JWT ${token}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        /**
                         * Error happend with request, fail the test
                         * with the error message.
                         */
                      if (err) {
                        done(err);
                      } else {
                        chai.expect(res.body)
                                .to.have.property('message')
                                .to.equal('Your information has been updated successfully. An email has been sent to your new email for the email confirmation.');
                        done();
                      }
                    });
            });
  });
});

describe('Client Profile API part 2', () => {
  let req;

  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes(() => {
        Client.insertMany(clients[1])
                    .then(() => {
                      const newClient = Object.assign({}, clients[0]);
                      newClient.status = 'confirmed';

                      new Client(newClient)
                            .save()
                            .then(() => {
                              req = supertest(app)
                                    .post('/api/v1/client/auth/login')
                                    .send({
                                      email: clients[0].email,
                                      password: clients[0].password,
                                    })
                                    .expect('Content-Type', /json/)
                                    .expect(200)
                                    .end((err, res) => {
                                      if (err) {
                                        done(err);
                                      } else {
                                        token = res.body.token;
                                        done();
                                      }
                                    });
                            })
                            .catch(done);
                    })
                    .catch((err) => {
                      done(err);
                    });
      });
    });
  });

  beforeEach(() => {
    req = supertest(app);
  });
    /**
     * Client edit his info without editing his mail
     */

  it('Client could update his info without updating the email', (done) => {
    const client1 = clients[0];
    Client.findOne({
      email: client1.email,
    })
            .exec()
            .then((client) => {
              req.post('/api/v1/client/profile/'.concat(client._id)
                        .concat('/edit'))
                    .send(notModifiedMail)
                    .expect('Content-Type', /json/)
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        /**
                         * Error happend with request, fail the test
                         * with the error message.
                         */

                      if (err) {
                        done(err);
                      } else {
                        chai.expect(res.body)
                                .to.have.property('message')
                                .to.equal('Your information has been updated successfully.');
                        done();
                      }
                    });
            });
  });
});
