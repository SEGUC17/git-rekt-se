/**
 * Utility Functions
 */

const Category = require('../../models/service/Category');

const addCategories = (categories) => {
  const resultCategories = categories.map((category) => {
    const categoryData = {
      type: 'Business',
      title: category,
    };
    return new Promise((resolve, reject) => {
      Category.create(categoryData)
        .then(resultCategory => resolve(resultCategory._id))
        .catch(reject);
    });
  });
  return Promise.all(resultCategories);
};

module.exports = {
  addCategories,
};
