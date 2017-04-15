const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');
const Business = require('../../../app/models/business/Business');
const Service = require('../../../app/models/service/Service');
const Coupon = require('../../../app/models/service/Coupon');
const Strings = require('../../../app/services/shared/Strings');
const BusinessesSeed = require('../../../app/seed/business/verifiedBusinessSeed');
const ServiceSeed = require('../../../app/seed/service/serviceSeed');
const CouponSeed = require('../../../app/seed/service/couponSeeds');

/**
 * Service Coupon CRUD Tests.
 */

describe('Service Coupon CRUD Tests', () => {
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
      Service.ensureIndexes(() => {
        Coupon.collection.drop(() => {
          Coupon.ensureIndexes((done));
        });
      });
    });
  });

  it('should create a coupon, and return a confirmation message: Coupon added succesfully!', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = CouponSeed[0];
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
              Coupon.findOne({
                code: coupon.code,
                _deleted: false,
              })
                .exec()
                .then((data) => {
                  chai.expect(`${data._service}`)
                    .to.equal(`${savedSer._id}`);
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

  it('should not create an Coupon if an invalid id is given, and return en error message', (done) => {
    const coupon = CouponSeed[0];
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
          chai.expect();
          done();
        }
      });
  });
  it('should not create a coupon if the date format is incorrect, and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      code: 'discount10',
      discount: '10',
      startDate: '1/1/2020',
      endDate: '13/11/2020', // not mm/dd/yyyy ,mm-dd-yyyy or mm.dd.yyyy
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
              Coupon.findOne({
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.invalidDateFormat);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });

  it('should not create a coupon if the expiration date is incorrect (in the past or before the start date), and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      code: 'discount10',
      discount: '10',
      startDate: '11/1/2020',
      endDate: '11/13/2010',
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
              Coupon.findOne({
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
                  chai.expect(result.body.errors[0])
                    .to.equal(Strings.couponValidationError.invalidEndDate);
                  done();
                })
                .catch(() => done(err));
            }
          });
      })
      .catch(err => done(err));
  });
  it('should not create a coupon if the code is missing, and return an error message', (done) => {
    const sampleService = ServiceSeed[0];
    sampleService._business = dbBusiness._id;
    const coupon = {
      // code: 'discount10',
      discount: '10',
      startDate: '11/1/2020',
      endDate: '11/13/2020',
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
              Coupon.findOne({
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
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
    const coupon = CouponSeed[1];
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
              Coupon.findOne({
                code: 'discount0',
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
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
    const coupon = CouponSeed[2];
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
              Coupon.findOne({
                code: 'discount0',
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
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
      code: 'discount10',
      // discount: '10',
      startDate: '11/1/2020',
      endDate: '11/13/2020',
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
              Coupon.findOne({
                code: 'discount0',
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
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
      code: 'discount10',
      discount: '10',
      // startDate: '11/1/2020',
      endDate: '11/13/2020',
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
              Coupon.findOne({
                code: 'discount0',
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.emptyStartDate);
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
      code: 'discount10',
      discount: '10',
      startDate: '11/1/2020',
      // endDate: '11/13/2020',
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
              Coupon.findOne({
                code: 'discount0',
                _service: savedSer._id,
              })
                .exec()
                .then((data) => {
                  chai.expect(data)
                    .to.equal(null);
                  chai.expect(result.body.errors[0].msg)
                    .to.equal(Strings.couponValidationError.emptyEndDate);
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
    newService.save()
      .then((newser) => {
        const coupon = CouponSeed[0];
        coupon._service = newser._id;
        new Coupon(coupon)
          .save()
          .then(() => {
            Coupon.findOne({
              code: 'discount10',
            })
              .exec()
              .then((newcoup) => {
                req = supertest(app)
                  .post(`/api/v1/service/${newser._id}/coupons/delete/${newcoup._id}`)
                  .set('Authorization', `JWT ${token}`)
                  .expect(200)
                  .end((err, res) => {
                    if (err) {
                      done(err);
                    } else {
                      Coupon.findOne({
                        _id: newcoup._id,
                      })
                        .exec()
                        .then((data) => {
                          chai.expect(res.body.message)
                            .to.equal(Strings.serviceSuccess.couponDelete);
                          chai.expect(data._deleted)
                            .to.equal(true);
                          done();
                        })
                        .catch(() => done(err));
                    }
                  });
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('should not delete a coupon if an invalid coupon id is given (correct id format, but no referenced coupon), and return an error message', (done) => {
    const newService = new Service(ServiceSeed[0]);
    newService._business = dbBusiness._id;
    newService.save()
      .then((newser) => {
        const coupon = CouponSeed[0];
        coupon._service = newser._id;
        new Coupon(coupon)
          .save()
          .then(() => {
            Coupon.findOne({
              code: 'discount10',
            })
              .exec()
              .then((newcoup) => {
                req = supertest(app)
                  .post(`/api/v1/service/${newser._id}/coupons/delete/${newser._id}`) // invalid coupon id
                  .set('Authorization', `JWT ${token}`)
                  .expect(400)
                  .end((err, res) => {
                    if (err) {
                      done(err);
                    } else {
                      Coupon.findOne({
                        _id: newcoup._id,
                      })
                        .exec()
                        .then((data) => {
                          chai.expect(res.body.errors[0])
                            .to.equal(Strings.couponValidationError.invalidCoupon);
                          chai.expect(data._deleted)
                            .to.equal(false);
                          done();
                        })
                        .catch(() => done(err));
                    }
                  });
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('should not delete a coupon if it does not belong to my business, and return an error message', (done) => {
    new Business(BusinessesSeed[1])
      .save()
      .then((ownerBusiness) => {
        const newService = new Service(ServiceSeed[0]);
        newService._business = ownerBusiness;
        newService.save()
          .then((newser) => {
            const coupon = CouponSeed[0];
            coupon._service = newser._id;
            new Coupon(coupon)
              .save()
              .then(() => {
                Coupon.findOne({
                  code: 'discount10',
                })
                  .exec()
                  .then((newcoup) => {
                    req = supertest(app)
                      .post(`/api/v1/service/${newser._id}/coupons/delete/${newcoup._id}`)
                      .set('Authorization', `JWT ${token}`)
                      .expect(400)
                      .end((err, res) => {
                        if (err) {
                          done(err);
                        } else {
                          Coupon.findOne({
                            _id: newcoup._id,
                          })
                            .exec()
                            .then((data) => {
                              chai.expect(res.body.errors[0])
                                .to.equal(Strings.serviceFailure.notYourService);
                              chai.expect(data._deleted)
                                .to.equal(false);
                              done();
                            })
                            .catch(() => done(err));
                        }
                      });
                  })
                  .catch(err => done(err));
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  after((done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Service.collection.drop(() => {
          Service.ensureIndexes(() => {
            Coupon.collection.drop(() => {
              Coupon.ensureIndexes((done));
            });
          });
        });
      });
    });
  });
});
