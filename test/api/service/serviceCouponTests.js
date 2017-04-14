const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Service = require('../../../app/models/service/Service');
const Strings = require('../../../app/services/shared/Strings');
const BusinessesSeed = require('../../../app/seed/business/verifiedBusinessSeed');
const ServiceSeed = require('../../../app/seed/service/serviceSeed');

/**
 * Service Gallery CRUD Tests.
 */

describe('Service Gallery CRUD Tests', () => {
  let req;
  let token;
  let sampleBusiness;
  let dbBusiness;
  before((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        sampleBusiness = BusinessesSeed[4];
        new Business(sampleBusiness)
          .save()
          .then((data) => {
            sampleBusiness._id = data._id;
            dbBusiness = data;
            req = supertest(app)
              .post('/api/v1/business/auth/verified/login')
              .send(sampleBusiness)
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
    Service.collection.drop(() => {
      Service.ensureIndexes(done);
    });
  });

  it('should create a coupon, and return a confirmation message: Coupon added succesfully!', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      code: 'free1222222',
      value: '10',
      expiration: '11/11/2020',
    };
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post(`/api/v1/service/${savedSer._id}/coupons/add`)
          .set('Authorization', `JWT ${token}`)
          .send(coupon)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, result) => {
            if (err) {
              done(err);
            } else {
              console.log(result.body);
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  console.log('000000000000000');
                  chai.expect(data.coupons).to.have.lengthOf(1); // correct
                  console.log('11111111111111111111111');
                  chai.expect(data.coupons).to.have.lengthOf(2); // incorrect
                  console.log('222222222222222222222'); // never reached
                  chai.expect(result.body.message) // never reached
                    .to.equal('Coupon added successfully!'); // never reached
                  console.log('33333333333333333333333'); // never reached
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  after((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Service.collection.drop(() => {
          Service.ensureIndexes(done);
        });
      });
    });
  });
});
