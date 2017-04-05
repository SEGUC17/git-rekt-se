const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app/app');
const businesses = require('../../../app/seed/business/verifiedBusinessSeed');
const Business = require('../../../app/models/business/Business');


const notModifiedMail = Object.assign({}, businesses[1]);
notModifiedMail.email = 'hadyyasser23@gmail.com';

mongoose.Promise = Promise;

describe('Should update business information correctly', () => {
  let req;
  let token;


  before((done) => {
    console.log('I run before the first it block.');
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        console.log('ok?');
        const business1 = new Business(businesses[0]);
        business1.password = 'Lenovo1100';
        business1.save();


        console.log('henaaaaaaaaaaaaaaaaaaaaaa');
        req = supertest(app)
                  .post('api/v1/business/auth/verified/login')
                  .send({
                    email: business1.email,
                    password: business1.password,
                  })
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                    if (err) {
                      console.log('hmmm?');
                      done(err);
                    } else {
                      token = res.body.token;
                      done();
                    }
                  });
      });
    });
  });

//   beforeEach(() => {
//     console.log('I run before every it block');
//     req = supertest(app)
//       .get('/api/v1/route_to_test');
//   });


  it('edit info without editing email', (done) => {
    console.log('ok????');
    const business1 = businesses[0];
    Business.findOne({
      email: business1.email,
    })
      .exec()
      .then((business) => {
        req.post('/api/v1/business/auth/update')
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


  /**
   * Passing test
   */

//   it('should do something modular, meaningful and pass', (done) => {
//     req.expect(404)
//       .end((err, res) => {
//         /**
//          * Error happend with request, fail the test
//          * with the error message.
//          */
//         if (err) {
//           return done(err);
//         }

//         /**
//          * Do something with the response
//          */

//         const doSomethingMeaningFul = res.body.message === 'Working' ? 1 : 0;

//         chai.expect(doSomethingMeaningFul)
//           .to.equal(0);

//         return done();
//       });
//   });
});
