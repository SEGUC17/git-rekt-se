const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const adminAuthAPI = require('./api/v1/admin/auth');
const ServiceAPI = require('./api/v1/service/general');

module.exports = (app) => {
  /**
   * Visitor Routes
   */
  app.use('/api/v1/service', ServiceAPI);
  /**
   * Client Routes
   */
  app.use('/api/v1/client/auth', clientAuthAPI);

  /**
   * Business Routes
   */
  app.use('/api/v1/business/auth', businessAuthAPI);

  /**
   * Admin Routes
   */
  app.use('/api/v1/admin/auth', adminAuthAPI);

  /**
   * Service Routes
   */
};
