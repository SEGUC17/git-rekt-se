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
                            Category.insertMany([businessCatgeories[0]]).then((docs) => {
                              invalidCategory = docs[0]._id;
                              done();
                            }).catch(e => done([e]));
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
 * Business Add Catgeories/Offerings Suite
 */
