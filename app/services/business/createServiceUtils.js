const Category = require('../../models/service/Category');
const Offering = require('../../models/service/Offering');

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
