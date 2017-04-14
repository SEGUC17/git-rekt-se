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
      expiration: '11/13/2020',
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
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data.coupons.length).to.equal(1);
                  chai.expect(result.body.message)
                    .to.equal(Strings.serviceSuccess.couponAdd);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should not create an image if an invalid id is given, and return en error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        const coupon = {
          code: 'free1222222',
          value: '10',
          expiration: '11/13/2020',
        };
        req = supertest(app)
          .post('/api/v1/service/1x/coupons/add')
          .set('Authorization', `JWT ${token}`)
          .send(coupon)
          .expect(400)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              chai.expect(res.body.errors[0].msg)
                .to.equal('Invalid Service ID');
              Service.findOne({
                _id: savedSer._id,
              }, (finderr, data) => {
                if (finderr) {
                  done(finderr);
                } else {
                  chai.expect(data.coupons.length)
                    .to.equal(0);
                  done();
                }
              });
            }
          });
      })
      .catch(err => done(err));
  });
  it('should not create a coupon if the code is missing, and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      // code: 'free1222222',
      value: '10',
      expiration: '11/13/2020',
    };
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post(`/api/v1/service/${savedSer._id}/coupons/add`)
          .set('Authorization', `JWT ${token}`)
          .send(coupon)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, result) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data.coupons.length).to.equal(0);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.emptyCode);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should not create a coupon if the discount value is 0%, and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      code: 'free1222222',
      value: '0',
      expiration: '11/13/2020',
    };
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post(`/api/v1/service/${savedSer._id}/coupons/add`)
          .set('Authorization', `JWT ${token}`)
          .send(coupon)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, result) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data.coupons.length).to.equal(0);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.invalidValue);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });
  it('should not create a coupon if the discount value is more than 100%, and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      code: 'free1222222',
      value: '101',
      expiration: '11/13/2020',
    };
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post(`/api/v1/service/${savedSer._id}/coupons/add`)
          .set('Authorization', `JWT ${token}`)
          .send(coupon)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, result) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data.coupons.length).to.equal(0);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.invalidValue);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });
  it('should not create a coupon if the discount value is missing, and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      code: 'free1222222',
      // value: '10',
      expiration: '11/13/2020',
    };
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post(`/api/v1/service/${savedSer._id}/coupons/add`)
          .set('Authorization', `JWT ${token}`)
          .send(coupon)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, result) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data.coupons.length).to.equal(0);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.emptyValue);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should not create a coupon if the expiration date is missing, and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      code: 'free1222222',
      value: '10',
      // expiration: '11/13/2020',
    };
    new Service(sampleService)
      .save()
      .then((savedSer) => {
        req = supertest(app)
          .post(`/api/v1/service/${savedSer._id}/coupons/add`)
          .set('Authorization', `JWT ${token}`)
          .send(coupon)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, result) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data.coupons.length).to.equal(0);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.emptyExpiration);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should delete a coupon, and return success message: coupon deleted succesfully!', (done) => {
    const newService = new Service(ServiceSeed[0]);
    newService._business = dbBusiness._id;
    const coupon = {
      code: 'free3',
      value: '10',
      expiration: '11/13/2020',
    };
    newService.coupons.push(coupon);
    newService.save()
      .then((newser) => {
        const newcoup = newser.coupons.find(element => `${element.code}` === 'free3');
        req = supertest(app)
          .post(`/api/v1/service/${newser._id}/coupons/delete/${newcoup._id}`)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: newser._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(res.body.message)
                    .to.equal(Strings.serviceSuccess.couponDelete);
                  chai.expect(data.coupons.length)
                    .to.equal(0);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should not delete a coupon if an invalid coupon id is given (correct id format, but no referenced coupon), and return an error message', (done) => {
    const newService = new Service(ServiceSeed[0]);
    newService._business = dbBusiness._id;
    const coupon = {
      code: 'free3',
      value: '10',
      expiration: '11/13/2020',
    };
    newService.coupons.push(coupon);
    newService.save()
      .then((newser) => {
        req = supertest(app)
          .post(`/api/v1/service/${newser._id}/coupons/delete/${newser._id}`) // invalid coupon id
          .set('Authorization', `JWT ${token}`)
          .expect(400)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: newser._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(res.body.errors[0])
                    .to.equal(Strings.couponValidationError.invalidCoupon);
                  chai.expect(data.coupons.length)
                    .to.equal(1);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should not delete a coupon if it does not belong to my business, and return an error message', (done) => {
    new Business(BusinessesSeed[1])
          .save()
          .then((ownerBusiness) => {
            const newService = new Service(ServiceSeed[0]);
            newService._business = ownerBusiness;
            const coupon = {
              code: 'free3',
              value: '10',
              expiration: '11/13/2020',
            };
            newService.coupons.push(coupon);
            newService.save()
      .then((newser) => {
        const newcoup = newser.coupons.find(element => `${element.code}` === 'free3');
        req = supertest(app)
          .post(`/api/v1/service/${newser._id}/coupons/delete/${newcoup._id}`) // invalid coupon id
          .set('Authorization', `JWT ${token}`)
          .expect(400)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              Service.findOne({
                _id: newser._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(res.body.errors[0])
                    .to.equal(Strings.serviceFailure.notYourService);
                  chai.expect(data.coupons.length)
                    .to.equal(1);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
          }).catch(err => done(err));
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
