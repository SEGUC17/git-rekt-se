/**
 * Utility Functions
 */

const Category = require('../../models/service/Category');
const Branch = require('../../models/service/Branch');

/**
 * Utility Function For Inserting Categories and returning a promise for all of them.
 * @param {[String]} categories
 * @returns {Promise}
 */
const addCategories = (categories) => {
  const resultCategories = categories.map((category) => {
    const categoryData = {
      type: 'Business',
      title: category,
    };
    /* eslint-disable no-underscore-dangle */
    return new Promise((resolve, reject) => {
      Category.create(categoryData)
        .then(resultCategory => resolve(resultCategory._id))
        .catch(reject);
    });
  });
  return Promise.all(resultCategories);
};

/**
 * Utility Function Inserting Branches and returning a promise for all of them.
 * @param {[String]} branches
 * @param {Business} business
 * @returns {Promise}
 */
const addBranches = (branches, business) => {
  const resultBranches = branches.map((branch) => {
    const branchData = {
      _business: business._id,
      location: branch.location,
      address: branch.address,
    };
    return new Promise((resolve, reject) => {
      Branch.create(branchData)
        .then(resultBranch => resolve(resultBranch._id))
        .catch(reject);
    });
  });
  return Promise.all(resultBranches);
};

module.exports = {
  addCategories,
  addBranches,
};
