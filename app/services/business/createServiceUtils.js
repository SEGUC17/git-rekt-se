const Category = require('../../models/service/Category');
const Offering = require('../../models/service/Offering');

/**
 * Utitlies for creating services.
 * @param {[mongoose.ObjectId]} categories - Array of Category IDs.
 * @returns {Promise} - Resolves if finding all categories was successfull,
 * otherwise rejects.
 */

const checkCategories = (categories) => {
  const results = categories.map(category => new Promise((resolve, reject) => {
    Category.findOne({
      _id: category,
      _deleted: false,
      type: 'Service',
    }).then((categoryDoc) => {
      resolve(categoryDoc);
    }).catch(reject);
  }));
  return Promise.all(results);
};

/**
 * Finds All Offerings.
 * @param {[mongoose.ObjectId]} offerings - Array of Offering IDs.
 * @returns {Promise} - Resolved if finding all Offerings was successfull,
 * otherwise rejects.
 */
const returnBranches = (offerings) => {
  const results = offerings.map(offering => new Promise((resolve, reject) => {
    Offering.findOne({
      _id: offering,
    }).then((offeringDoc) => {
      resolve(offeringDoc);
    }).catch(reject);
  }));
  return Promise.all(results);
};

module.exports = {
  checkCategories,
  returnBranches,
};
