const Branch = require('../../models/service/Branch');
const Business = require('../../models/business/Business');

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

const getRelatedBusinesses = ((categories, id) => {
  const resultBusinesses = categories.map(category => new Promise((resolve, reject) => {
    Business.find({
      categories: {
        $in: [category],
      },
      _deleted: false,
      _id: {
        $ne: id,
      },
    }, {
      shortDescription: true,
      name: true,
      _id: true,
    }).exec().then((businesses) => {
      resolve(businesses);
    }).catch(reject);
  }));
  return Promise.all(resultBusinesses);
});

module.exports = {
  addBranches,
  editOfferings,
  getRelatedBusinesses,
};
