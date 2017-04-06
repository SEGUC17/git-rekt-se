const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const businessAPI = require('./api/v1/business/business');
const businessGeneralAPI = require('./api/v1/business/general');
const adminAuthAPI = require('./api/v1/admin/auth');
const businessServiceAPI = require('./api/v1/business/index');
const clientProfileAPI = require('./api/v1/client/profile');
const ServiceAPI = require('./api/v1/service/serviceRoutes');
const ServiceGeneralAPI = require('./api/v1/service/general');
const reviewCRUDAPI = require('./api/v1/service/review');
const businessProfileAPI = require('./api/v1/business/profile');


module.exports = (app) => {
  /**
   * Visitor Routes
   */
  app.use('/api/v1/service', ServiceAPI);
  app.use('/api/v1/business', businessGeneralAPI);
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
  app.use('/api/v1/service', businessServiceAPI);
  app.use('/api/v1/business/profile', businessProfileAPI);
  app.use('/api/v1/business', businessAPI);

  /**
   * Admin Routes
   */
  app.use('/api/v1/admin/auth', adminAuthAPI);

  /**
   * Service Routes
   */

  app.use('/api/v1/service', reviewCRUDAPI);
};
