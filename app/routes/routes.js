const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const businessAPI = require('./api/v1/business/business');
const businessGeneralAPI = require('./api/v1/business/general');
const adminAuthAPI = require('./api/v1/admin/auth');
<<<<<<< HEAD
const ServiceGeneralAPI = require('./api/v1/service/general');
=======
const clientProfileAPI = require('./api/v1/client/profile');
>>>>>>> b2910c31f80132540be2e5505cfce6f1ffaf4d0b

module.exports = (app) => {
  /**
   * Visitor Routes
   */
  app.use('/api/v1/service/category', ServiceGeneralAPI);
  app.use('/api/v1/business/category', businessGeneralAPI);
  /**
   * Client Routes
   */
  app.use('/api/v1/client/auth', clientAuthAPI);
  app.use('/api/v1/client/profile', clientProfileAPI);

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
};
