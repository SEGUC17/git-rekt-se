const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const businessAPI = require('./api/v1/business/business');
const businessGeneralAPI = require('./api/v1/business/general');
const adminAuthAPI = require('./api/v1/admin/auth');
const adminGeneral = require('./api/v1/admin/general');
const clientProfileAPI = require('./api/v1/client/profile');
const ServiceGeneralAPI = require('./api/v1/service/general');
const reviewCRUDAPI = require('./api/v1/service/review');


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
  app.use('/api/v1/admin/general', adminGeneral);

  /**
   * Service Routes
   */

  app.use('/api/v1/service', reviewCRUDAPI);
};
