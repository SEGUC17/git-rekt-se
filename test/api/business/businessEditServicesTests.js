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
 * Business Edit Catgeories/Offerings Suite
 */

describe('Business Edit Categories/Offerings Suite', () => {
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
   * Passing Test1: Business can edit a service with attributes
   */

  it('should edit an existing service with its attributes', (done) => {
    const service = new Service({
      name: 'Hello world',
      shortDescription: 'Hello world also !!',
      _business: businessesIDs[0],
    });
    service.save()
      .then((savedService) => {
        req = supertest(app)
          .post(`/api/v1/business/service/${savedService._id}/edit`);
        const serviceInfo = {
          name: 'Team Managemet',
          shortDescription: 'Teaching Team Management',
          description: 'We will make you better',
          categories: [categoriesIDs[2], categoriesIDs[4]],
        };
        req
          .send(serviceInfo)
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
              name: 'Team Managemet',
            })
              .then((services) => {
                chai.expect(services)
                  .to.have.lengthOf(1);
                chai.expect(services[0].shortDescription)
                  .to.equal('Teaching Team Management');
                chai.expect(services[0].description)
                  .to.equal('We will make you better');
                chai.expect(services[0].categories)
                  .to.have.lengthOf(2);
                chai.expect(res.body.message)
                  .to.equal(Strings.serviceSuccess.serviceEdited);
                servicesAdded.push(services[0]);
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
        Service.findOne({
          _id: servicesAdded[0]._id,
        })
          .then((serviceDoc) => {
            serviceDoc.offerings.push(savedOffering);
            serviceDoc.save()
              .then((serviceDoc2) => {
                const offering2 = {
                  startDate: Date.now(),
                  endDate: Date.now(),
                  branch: businesses[0].branches[1],
                  price: 5000,
                };
                req = supertest(app)
                  .post(`/api/v1/business/service/${serviceDoc2._id}/offering/${savedOffering._id}/edit`);

                req
                  .send(offering2)
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
                    Offering.find({
                      _id: savedOffering._id,
                    })
                      .then((offerings) => {
                        chai.expect(offerings)
                          .to.have.lengthOf(1);
                        chai.expect(offerings[0].startDate)
                          .not.to.equal('');
                        chai.expect(offerings[0].endDate)
                          .not.to.equal('');
                        chai.expect(offerings[0].price)
                          .to.equal(5000);
                        chai.expect(offerings[0].location)
                          .to.equal('Zamalek');
                        chai.expect(offerings[0].address)
                          .to.equal('some address1');
                        chai.expect(res.body.message)
                          .to.equal(Strings.serviceSuccess.offeringEdited);
                        offeringsAdded.push(offerings[0]);
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
   * Failing Test 1: missing field when editing a serivce without specifying name
   */

  it('should return missing field when adding a service without name', (done) => {
    req = supertest(app)
      .post(`/api/v1/business/service/${servicesAdded[0]._id}/edit`);
    const serviceInfo = {
      shortDescription: 'Hi',
    };
    req
      .send(serviceInfo)
      .set('Authorization', `JWT ${token}`);

    req.expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        chai.expect(res.body.errors[0].msg)
          .to.equal(Strings.serviceValidationCRUDErrors.emptyName);
        done();
      });
  });

  /**
   * Failing Test 2: invalid category error when choosing an invalid category in the request
   */

  it('should return invalid category', (done) => {
    req = supertest(app)
      .post(`/api/v1/business/service/${servicesAdded[0]._id}/edit`);
    const serviceInfo = {
      name: 'Hi',
      shortDescription: 'Hi',
      categories: [invalidCategory],
    };
    req
      .send(serviceInfo)
      .set('Authorization', `JWT ${token}`);

    req.expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        chai.expect(res.body.errors[0])
          .to.equal(Strings.serviceValidationCRUDErrors.invalidCategory);
        done();
      });
  });

  /**
   * Failing Test 3:editing to a branch that doesn't belong to you
   */

  it('should return an invalid branch error', (done) => {
    req = supertest(app)
      .post(`/api/v1/business/service/${servicesAdded[0]._id}/offering/${offeringsAdded[0]._id}/edit/`);
    const offeringInfo = {
      startDate: Date.now(),
      endDate: Date.now(),
      branch: businesses[1].branches[0],
      price: 1000,
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
          .to.equal(Strings.offeringValidationError.invalidBranch);
        done();
      });
  });

  /**
   * Failing Test 4:editing an offering to a service that doesn't belong to this business
   */

  it('should return an invalid Operation error when trying to edit services for other businesses', (done) => {
    const service = new Service({
      name: 'test1',
      shortDescription: 'test1',
      _business: businessesIDs[1],
    });
    service.save()
      .then((serviceAdded) => {
        req = supertest(app)
          .post(`/api/v1/business/service/${serviceAdded._id}/edit`);
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
});
