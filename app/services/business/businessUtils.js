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

const editOfferings = (services, branchID, deleteFlag, callBack) => {
  const resultServices = services.map((service) => {
    service.offerings.forEach((offering) => {
      if (offering.branch.equals(branchID)) {
        callBack(offering);
      }
    });
    service.markModified('offerings');
    if (deleteFlag) {
      service.branches.pull(branchID);
    }
    service.save();
    return new Promise((resolve, reject) => {
      service
        .save()
        .then(resultService => resolve(resultService._id))
        .catch(reject);
    });
  });
  return Promise.all(resultServices);
};

module.exports = {
  addBranches,
  editOfferings,
};
