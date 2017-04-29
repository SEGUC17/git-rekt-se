const Service = require('../../models/service/Service');

const getRelatedServices = ((categories, id) => {
  const resultServices = categories.map(category => new Promise((resolve, reject) => {
    Service.find({
      categories: {
        $in: [category],
      },
      _deleted: false,
      _id: {
        $ne: id,
      },
    }, {
      coverImage: true,
      name: true,
      _id: true,
    }).exec().then((services) => {
      resolve(services);
    }).catch(reject);
  }));
  return Promise.all(resultServices);
});

module.exports = {
  getRelatedServices,
};
