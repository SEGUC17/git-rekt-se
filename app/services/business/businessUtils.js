const Branch = require('../../models/service/Branch');

/**
 * @typedef {Object} branch
 * @property {string} location - Branch's Location.
 * @property {string} address - Branch's Address.
 */

/**
 * Utility Function for parsing and creating an array of branches and returning a Promise
 * @param {[branch]} branches
 * @param {ObjectId} businessID
 * @returns {Promise<[branch]>} - Resolves if saving all branches was successfull, otherwise
 * reject.
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
