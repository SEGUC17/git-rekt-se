const Branch = require('../../models/service/Branch');

/**
 * Utility Function for parsing and creating an array of branches and returning a Promise
 * @param {Object} branches
 * @param {ObjectId} businessID
 * @returns {Promise}
 */

const addBranches = (branches, businessID) => {
  const resultBranches = branches.map((branch) => {
    const branchData = {
      _business: businessID,
      location: branch.location,
      address: branch.address,
    };
    return new Promise((resolve, reject) => {
      new Branch(branchData)
        .save()
        .then(resultBranch => resolve(resultBranch._id))
        .catch(reject);
    });
  });
  return Promise.all(resultBranches);
};

module.exports = {
  addBranches,
};
