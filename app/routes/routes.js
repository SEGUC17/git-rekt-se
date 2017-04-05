const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const businessAPI = require('./api/v1/business/business');
const businessGeneralAPI = require('./api/v1/business/general');
const adminAuthAPI = require('./api/v1/admin/auth');
//<<<<<<< HEAD
const admincatAPI = require('./api/v1/admin/category');
// =======
const ServiceGeneralAPI = require('./api/v1/service/general');
// >>>>>>> 712fb89f7b872dc40ba00f76ac497a3863fc3231

module.exports = (app) => {
  /**
   * Visitor Routes
   */
  app.use('/api/v1/business', businessGeneralAPI);
  app.use('/api/v1/service/category', ServiceGeneralAPI);
  app.use('/api/v1/business/category', businessGeneralAPI);
  /**
   * Client Routes
   */
  app.use('/api/v1/client/auth', clientAuthAPI);

  /**
   * Business Routes
   */
  app.use('/api/v1/business/auth', businessAuthAPI);
  app.use('/api/v1/business', businessAPI);

  /**
   * Admin Routes
   */
  app.use('/api/v1/admin/auth', adminAuthAPI);

  /**
   * Service Routes
   */
  app.use('/api/v1/admin/category', admincatAPI);
};
