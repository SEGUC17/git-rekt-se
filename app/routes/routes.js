const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const adminAuthAPI = require('./api/v1/admin/auth');
const visitorSearchAPI = require('./api/v1/visitor/search');

module.exports = (app) => {
  /**
   * Visitor Routes
   */
  app.use('/api/v1/visitor/search', visitorSearchAPI);
  /**
   * Client Routes
   */
  app.use('/api/v1/client/auth', clientAuthAPI);

  /**
   * Business Routes
   */
  app.use('/api/v1/client/auth', businessAuthAPI);

  /**
   * Admin Routes
   */
  app.use('/api/v1/admin/auth', adminAuthAPI);

  /**
   * Service Routes
   */
};
