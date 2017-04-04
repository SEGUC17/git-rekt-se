const Branch = require('../../models/service/Branch');

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
