const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Client = require('../../../app/models/client/Client');
const clients = require('../../../app/seed/client/clientSeed');

const modifiedMail = {
  email: 'atherkhalid44@hotmail.com',
  password: 'YEQmxoav4NqK',
  confirmPassword: 'YEQmxoav4NqK',
  firstName: 'Ather',
  lastName: 'Hejazi',
  mobile: '01193125263',
  gender: 'Male',
  birthdate: new Date('11-2-1996'),
};

const notModifiedMail = {
  email: 'atherkhalid158@gmail.com',
  password: 'YEQmxoav4NqK',
  confirmPassword: 'YEQmxoav4NqK',
  firstName: 'Ather',
  lastName: 'Hejazi',
  mobile: '01193125263',
  gender: 'Male',
  birthdate: new Date('11-2-1996'),
};

/**
 * Client Edit info Suite
 */


describe('Client Profile API', () => {
  let req;

  before((done) => {
    Client.collection.drop(() => {
      Client.ensureIndexes();
    });
    Client.insertMany(clients)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  beforeEach(() => {
    req = supertest(app);
  });

  /**
   * Client edit his info with editing his mail
   */

  it('Client could update his info with updating the email', (done) => {
    const client1 = clients[1];
    Client.findOne({
      email: client1.email,
    })
      .exec()
      .then((client) => {
        req.post('/api/v1/client/profile/'.concat(client.id)
            .concat('/edit'))
          .send(modifiedMail)
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
                .to.equal('Your information has been updated successfully. An email has been sent to your new email for the email confirmation');
              done();
            }
          });
      });
  });

  /**
   * Client edit his info without editing his mail
   */

  it('Client could update his info without updating the email', (done) => {
    const client1 = clients[1];
    Client.findOne({
      email: client1.email,
    })
      .exec()
      .then((client) => {
        req.post('/api/v1/client/profile/'.concat(client.id)
            .concat('/edit'))
          .send(notModifiedMail)
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
                .to.equal('Your information has been updated successfully.');
              done();
            }
          });
      });
  });
});
