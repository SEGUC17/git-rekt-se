const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const businessAPI = require('./api/v1/business/business');
const businessGeneralAPI = require('./api/v1/business/general');
const adminAuthAPI = require('./api/v1/admin/auth');

module.exports = (app) => {
  /**
   * Visitor Routes
   */
  app.use('/api/v1/business/category', businessGeneralAPI);
  /**
   * Client Routes
   */
  app.use('/api/v1/client/auth', clientAuthAPI);

  /**
   * Business Routes
   */
  app.use('/api/v1/business/auth', businessAuthAPI);
  app.use('/api/v1/business/edit', businessAPI);

  /**
   * Admin Routes
   */
  app.use('/api/v1/admin/auth', adminAuthAPI);

  /**
   * Service Routes
   */
};
