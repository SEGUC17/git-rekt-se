const Category = require('../../models/service/Category');

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

module.exports = {
  checkCategories,
};
