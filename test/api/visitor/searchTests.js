const chai = require('chai');
const supertest = require('supertest');
const app = require('../../../app/app');

const verifiedBusinessSeed = require('../../../app/seed/business/verifiedBusinessSeed');
const unverifiedBusinessSeed = require('../../../app/seed/business/unverifiedBusinessSeed');
const businessSeed = require('../../../app/seed/business/searchTestExtraBusiness.js');
const categoriesSeed = require('../../../app/seed/service/categoriesSeed');
const branches = require('../../../app/seed/service/branchesSeed.js');
const services = require('../../../app/seed/service/searchServicesSeed');
const offerings = require('../../../app/seed/service/searchOfferingsSeed');

const Business = require('../../../app/models/business/Business');
const Category = require('../../../app/models/service/Category');
const Branch = require('../../../app/models/service/Branch');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');

const Strings = require('../../../app/services/shared/Strings');


/**
 * Search Test Suite
 */

/**
 * Database values https://docs.google.com/spreadsheets/d/1wKof9vtCAZjTy7zxLsaujPrW7oZD50lTnntcwLtxq2M/edit#gid=0
 */

describe('Search Test Suite', () => {
  let req;

  const branch = new Branch(branches[0]);

  const business0 = new Business(verifiedBusinessSeed[2]);
  const business1 = new Business(verifiedBusinessSeed[3]);
  const business2 = new Business(verifiedBusinessSeed[0]);
  const business3 = new Business(verifiedBusinessSeed[1]);
  const business4 = new Business(unverifiedBusinessSeed[0]);
  const business5 = new Business(businessSeed[0]);

  const category0 = new Category(categoriesSeed[3]);
  const category1 = new Category(categoriesSeed[5]);
  const category2 = new Category(categoriesSeed[4]);

  const properOfferings = [];


  after((done) => {
    Service.collection.drop(() => {
      Service.ensureIndexes(() => {
        Branch.collection.drop(() => {
          Branch.ensureIndexes(() => {
            Category.collection.drop(() => {
              Category.ensureIndexes(() => {
                Business.collection.drop(() => {
                  Business.ensureIndexes(() => {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  before((done) => {
    Service.collection.drop(() => {
      Service.ensureIndexes(() => {
        Branch.collection.drop(() => {
          Branch.ensureIndexes(() => {
            Category.collection.drop(() => {
              Category.ensureIndexes(() => {
                Business.collection.drop(() => {
                  Business.ensureIndexes(() => {
                    business0.save((err, savedBusiness0) => {
                      if (err) {
                        done(err);
                        return;
                      }
                      business1.save((err2, savedBusiness1) => {
                        if (err2) {
                          done(err2);
                          return;
                        }
                        business2.save((err3, savedBusiness2) => {
                          if (err3) {
                            done(err3);
                            return;
                          }
                          business3.save((err4, savedBusiness3) => {
                            if (err4) {
                              done(err4);
                              return;
                            }
                            business4.save((err5, savedBusiness4) => {
                              if (err5) {
                                done(err5);
                                return;
                              }
                              business5.save((err6, savedBusiness5) => {
                                if (err6) {
                                  done(err6);
                                  return;
                                }
                                category0.save((err7, savedCategory0) => {
                                  if (err7) {
                                    done(err7);
                                    return;
                                  }
                                  category1.save((err8, savedCategory1) => {
                                    if (err8) {
                                      done(err8);
                                      return;
                                    }
                                    category2.save((err9, savedCategory2) => {
                                      if (err9) {
                                        done(err9);
                                        return;
                                      }
                                      branch.save((err10, savedBranch) => {
                                        if (err10) {
                                          done(err10);
                                          return;
                                        }
                                        offerings.forEach((offering) => {
                                          offering.branch = savedBranch._id;
                                          properOfferings.push(new Offering(offering));
                                        });

                                        services[0]._business = savedBusiness0._id;
                                        services[0].categories.push(savedCategory0._id);
                                        services[0].categories.push(savedCategory2._id);

                                        services[1]._business = savedBusiness1._id;
                                        services[1].categories.push(savedCategory0._id);

                                        services[2]._business = savedBusiness0._id;

                                        services[3]._business = savedBusiness2._id;
                                        services[3].categories.push(savedCategory1._id);

                                        services[4]._business = savedBusiness3._id;

                                        services[5]._business = savedBusiness4._id;
                                        services[5].categories.push(savedCategory2._id);

                                        services[6]._business = savedBusiness5._id;

                                        services[7]._business = savedBusiness5._id;

                                        services[8]._business = savedBusiness5._id;

                                        services[9]._business = savedBusiness2._id;

                                        services[10]._business = savedBusiness5._id;

                                        services[11]._business = savedBusiness5._id;

                                        services[12]._business = savedBusiness5._id;

                                        services[13]._business = savedBusiness5._id;

                                        services[14]._business = savedBusiness5._id;

                                        services[15]._business = savedBusiness5._id;

                                        services[16]._business = savedBusiness5._id;

                                        services[17]._business = savedBusiness5._id;

                                        services[18]._business = savedBusiness5._id;

                                        services[19]._business = savedBusiness5._id;

                                        services[20]._business = savedBusiness5._id;

                                        services[21]._business = savedBusiness5._id;
                                        services[21].categories.push(savedCategory0._id);

                                        Service.insertMany(services, (errX, docs) => {
                                          if (errX) {
                                            done(errX);
                                            return;
                                          }
                                          Service.find({}, (errP, properServices) => {
                                            properServices[0].offerings.push(properOfferings[0]);
                                            properServices[0].offerings.push(properOfferings[1]);

                                            properServices[1].offerings.push(properOfferings[2]);
                                            properServices[1].offerings.push(properOfferings[3]);

                                            properServices[2].offerings.push(properOfferings[4]);

                                            properServices[3].offerings.push(properOfferings[5]);
                                            properServices[3].offerings.push(properOfferings[6]);

                                            properServices[4].offerings.push(properOfferings[7]);

                                            properServices[5].offerings.push(properOfferings[8]);

                                            properServices[6].offerings.push(properOfferings[1]);

                                            properServices[7].offerings.push(properOfferings[9]);

                                            properServices[8].offerings.push(properOfferings[10]);

                                            properServices[9].offerings.push(properOfferings[11]);

                                            properServices[10].offerings.push(properOfferings[2]);

                                            properServices[11].offerings.push(properOfferings[2]);

                                            properServices[12].offerings.push(properOfferings[2]);

                                            properServices[13].offerings.push(properOfferings[2]);

                                            properServices[14].offerings.push(properOfferings[2]);

                                            properServices[15].offerings.push(properOfferings[2]);

                                            properServices[16].offerings.push(properOfferings[2]);

                                            properServices[17].offerings.push(properOfferings[2]);

                                            properServices[18].offerings.push(properOfferings[2]);

                                            properServices[19].offerings.push(properOfferings[2]);

                                            properServices[20].offerings.push(properOfferings[2]);

                                            properServices[21].offerings
                                              .push(properOfferings[12]);

                                            let len = properServices.length;
                                            properServices.forEach((properService) => {
                                              properService.save((errZ) => {
                                                len -= 1;
                                                if (errZ) {
                                                  done(errZ);
                                                  return;
                                                }
                                                if (len === 0) {
                                                  done();
                                                }
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  beforeEach(() => {
    req = supertest(app)
      .get('/api/v1/visitor/search');
  });


  it('should return a page full of results if no query is specified', (done) => {
    req.expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(res.body.count)
          .to.equal(21);

        chai.expect(res.body.results.length)
          .to.equal(10);

        return done();
      });
  });

  it('should return only the results matching the location query if specified', (done) => {
    req
      .query({
        location: 'Tagamo3',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        chai.expect(res.body.count)
          .to.equal(13);

        chai.expect(res.body.results.length)
          .to.equal(10);

        return done();
      });
  });

  it('should return only the reults needed if an offset is specified', (done) => {
    req
      .query({
        location: 'Tagamo3',
        offset: 1,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        chai.expect(res.body.count)
          .to.equal(13);

        chai.expect(res.body.results.length)
          .to.equal(3);

        return done();
      });
  });

  it('should return only the results matching the location & rating query', (done) => {
    req
      .query({
        location: 'Tagamo3',
        rating: 8,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(res.body.count)
          .to.equal(2);

        return done();
      });
  });

  it('should match by name even if it is partially matching and ignoreing case ', (done) => {
    req
      .query({
        name: 'german',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(res.body.count)
          .to.equal(1);
        chai.expect(res.body.results[0].name)
          .to.equal('German Course');

        return done();
      });
  });

  it('should not return a result if offerings seperately match the query', (done) => {
    req
      .query({
        location: 'Nasr City',
        max: 2500,
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(res.body.errors[0])
          .to.equal(Strings.searchErrors.emptySearchResult);

        return done();
      });
  });

  it('should not return a deleted service', (done) => {
    req
      .query({
        name: 'Italian Lesson',
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(res.body.errors[0])
          .to.equal(Strings.searchErrors.emptySearchResult);

        return done();
      });
  });

  it('should return an error message if the query does not return any results', (done) => {
    req
      .query({
        location: 'Tagamo3',
        max: 1000,
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(res.body.errors[0])
          .to.equal(Strings.searchErrors.emptySearchResult);

        return done();
      });
  });
});
