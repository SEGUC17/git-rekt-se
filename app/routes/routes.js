const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const adminAuthAPI = require('./api/v1/admin/auth');
const clientProfileAPI = require('./api/v1/client/profile');

module.exports = (app) => {
  /**
   * Client Routes
   */
  app.use('/api/v1/client/auth', clientAuthAPI);
  app.use('/api/v1/client/profile', clientProfileAPI);

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
