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

});
