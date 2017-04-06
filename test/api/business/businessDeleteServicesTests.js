/**
 * API Testing Template
 */

const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app/app');

mongoose.Promise = Promise;

const branches = require('../../../app/seed/service/branchesCrudSeed');
const businesses = require('../../../app/seed/business/businessCrudServiceSeed');
const serviceCatgeories = require('../../../app/seed/service/serviceCatgeoriesSeed');
const businessCatgeories = require('../../../app/seed/service/businessCategoriesSeed');

const Business = require('../../../app/models/business/Business');
const Branch = require('../../../app/models/service/Branch');
const Service = require('../../../app/models/service/Service');
const Offering = require('../../../app/models/service/Offering');
const Category = require('../../../app/models/service/Category');

const Strings = require('../../../app/services/shared/Strings');

const businessesIDs = [];
const categoriesIDs = [];
let invalidCategory;


/**
 * Database Connection
 */

require('dotenv')
  .config();

/**
 * Droping the Database Collections Suite
 */

describe('Dropping the Database Collections', () => {
  it('should drop the database collections', (done) => {
    Business.collection.drop(() => {
      Business.ensureIndexes(() => {
        Service.collection.drop(() => {
          Service.ensureIndexes(() => {
            Offering.collection.drop(() => {
              Offering.ensureIndexes(() => {
                Branch.collection.drop(() => {
                  Branch.ensureIndexes(() => {
                    Category.collection.drop(() => {
                      Category.ensureIndexes(() => {
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
    });
  });
});

/**
 * Populating Business, Branches collection with businessSeed
 * and saving their IDs in businesses array
 */

describe('Populating Business Collection', () => {
  it('should enter businesses and branches in the Business collection', (done) => {
    const business1 = new Business({
      name: businesses[0].name,
      email: businesses[0].email,
      shortDescription: businesses[0].shortDescription,
      password: businesses[0].password,
      _status: businesses[0]._status,
    });

    const business2 = new Business({
      name: businesses[1].name,
      email: businesses[1].email,
      shortDescription: businesses[1].shortDescription,
      password: businesses[1].password,
      _status: businesses[1]._status,
    });

    business1.save()
      .then((savedBusiness1) => {
        business2.save()
          .then((savedBusiness2) => {
            businessesIDs.push(savedBusiness1._id);
            businessesIDs.push(savedBusiness2._id);

            branches[0]._business = savedBusiness1;
            branches[1]._business = savedBusiness1;
            branches[2]._business = savedBusiness1;
            branches[3]._business = savedBusiness2;
            branches[4]._business = savedBusiness2;

            Branch.insertMany(branches)
              .then((branchDocs) => {
                savedBusiness1.branches = [branchDocs[0]._id, branchDocs[1]._id, branchDocs[2]._id];
                savedBusiness2.branches = [branchDocs[3]._id, branchDocs[4]._id];

                businesses[0].branches = [branchDocs[0]._id, branchDocs[1]._id, branchDocs[2]._id];
                businesses[1].branches = [branchDocs[3]._id, branchDocs[4]._id];

                business1.save()
                  .then((doc1) => {
                    business2.save()
                      .then((doc2) => {
                        Category.insertMany(serviceCatgeories)
                          .then((categoriesDocs) => {
                            categoriesIDs.push(categoriesDocs[0]._id);
                            categoriesIDs.push(categoriesDocs[1]._id);
                            categoriesIDs.push(categoriesDocs[2]._id);
                            categoriesIDs.push(categoriesDocs[3]._id);
                            categoriesIDs.push(categoriesDocs[4]._id);
                            Category.insertMany([businessCatgeories[0]])
                              .then((docs) => {
                                invalidCategory = docs[0]._id;
                                done();
                              })
                              .catch(e => done([e]));
                          })
                          .catch(e => done([e]));
                      })
                      .catch(e => done([e]));
                  })
                  .catch(e => done([e]));
              })
              .catch(e => done([e]));
          })
          .catch(e => done([e]));
      })
      .catch(e => done([e]));
  });
});

/**
 * Business Delete Catgeories/Offerings Suite
 */

describe('Business Delete Categories/Offerings Suite', () => {
  let req;
  let token;
  const servicesAdded = [];
  const offeringsAdded = [];

  before((done) => {
    const businessLogin = {
      email: businesses[0].email,
      password: businesses[0].password,
    };
    req = supertest(app)
      .post('/api/v1/business/auth/verified/login')
      .send(businessLogin)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          token = res.body.token;
          done();
        }
      });
  });

  /**
   * Passing Test1: Business can delete a service
   */

  it('should delete a service', (done) => {
    const service = new Service({
      name: 'Hello world',
      shortDescription: 'Hello world also !!',
      _business: businessesIDs[0],
    });
    service.save()
      .then((serviceDoc) => {
        req = supertest(app)
          .post(`/api/v1/business/service/${serviceDoc._id}/delete`);
        req
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
              return;
            }

            /**
             * Checking the content of the response
             */
            Service.find({
              name: 'Hello world',
            })
              .then((services) => {
                chai.expect(services)
                  .to.have.lengthOf(1);

                chai.expect(services[0].name)
                  .to.equal('Hello world');
                chai.expect(services[0]._deleted)
                  .to.equal(true);
                chai.expect(res.body.message)
                  .to.equal(Strings.serviceSuccess.serviceDeleted);
                done();
              })
              .catch(e => done([e]));
          });
      })
      .catch(e => done([e]));
  });

  /**
   * Passing Test2: Business can edit an offering with its attributes
   */

  it('should edit an existing offering with its attributes', (done) => {
    const service = new Service({
      name: 'Hello world',
      shortDescription: 'Hello world also !!',
      _business: businessesIDs[0],
    });
    service.save()
      .then((serviceDoc) => {
        const offering = new Offering({
          startDate: Date.now(),
          endDate: Date.now(),
          branch: businesses[0].branches[0],
          location: 'Nasr City',
          address: 'abbas elakkad',
          price: 1000,
        });
        offering.save()
          .then((savedOffering) => {
            serviceDoc.offerings.push(savedOffering);
            serviceDoc.save()
              .then((serviceDoc2) => {
                req = supertest(app)
                  .post(`/api/v1/business/service/${serviceDoc2._id}/offering/${savedOffering._id}/delete`);

                req
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
                      return;
                    }

                    /**
                     * Checking the content of the response
                     */
                    Service.find({
                      _id: serviceDoc2._id,
                    })
                      .then((serviceDoc3) => {
                        chai.expect(serviceDoc3)
                          .to.have.lengthOf(1);
                        chai.expect(serviceDoc3[0].name)
                          .to.equal('Hello world');

                        chai.expect(serviceDoc3[0].offerings)
                          .to.have.lengthOf(1);
                        chai.expect(serviceDoc3[0].offerings[0]._deleted)
                          .to.equal(false);
                        chai.expect(serviceDoc3[0].branches)
                          .to.have.lengthOf(0);
                        chai.expect(res.body.message)
                          .to.equal(Strings.serviceSuccess.offeringDeleted);
                        done();
                      })
                      .catch(e => done([e]));
                  });
              })
              .catch(e => done([e]));
          })
          .catch(e => done([e]));
      })
      .catch(e => done([e]));
  });

  /**
   * Failing Test 1:deleting a service that doesn't belong to this business
   */

  it('should return an invalid Operation error when trying to delte services for other businesses', (done) => {
    const service = new Service({
      name: 'test1',
      shortDescription: 'test1',
      _business: businessesIDs[1],
    });
    service.save()
      .then((serviceAdded) => {
        req = supertest(app)
          .post(`/api/v1/business/service/${serviceAdded._id}/delete`);
        const offeringInfo = {
          name: 'test2',
          shortDescription: 'test2',
        };
        req
          .send(offeringInfo)
          .set('Authorization', `JWT ${token}`);

        req.expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            chai.expect(res.body.errors[0])
              .to.equal(Strings.offeringValidationError.invalidOperation);
            done();
          });
      })
      .catch(e => done([e]));
  });

  /**
   * Failing Test 2:deleting an offering to a service that doesn't belong to this business
   */

  it('should return an invalid Operation error when trying to edit services for other businesses services', (done) => {
    const service = new Service({
      name: 'Hello world',
      shortDescription: 'Hello world also !!',
      _business: businessesIDs[1],
    });
    service.save()
      .then((serviceDoc) => {
        const offering = new Offering({
          startDate: Date.now(),
          endDate: Date.now(),
          branch: businesses[1].branches[0],
          location: 'Nasr City',
          address: 'abbas elakkad',
          price: 1000,
        });
        offering.save()
          .then((savedOffering) => {
            serviceDoc.offerings.push(savedOffering);
            serviceDoc.save()
              .then((serviceDoc2) => {
                req = supertest(app)
                  .post(`/api/v1/business/service/${serviceDoc2._id}/offering/${savedOffering._id}/delete`);
                req
                  .set('Authorization', `JWT ${token}`);
                req.expect('Content-Type', /json/)
                  .expect(400)
                  .end((err, res) => {
                    if (err) {
                      done(err);
                    }
                    chai.expect(res.body.errors[0])
                      .to.equal(Strings.offeringValidationError.invalidOperation);
                    done();
                  });
              })
              .catch(e => done([e]));
          })
          .catch(e => done([e]));
      })
      .catch(e => done([e]));
  });
});
