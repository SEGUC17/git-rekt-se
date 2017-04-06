const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const businessAPI = require('./api/v1/business/business');
const ViewBussinessAPI = require('./api/v1/business/index');
const RelatedBusinessAPI = require('./api/v1/business/related');
const adminAuthAPI = require('./api/v1/admin/auth');
const clientProfileAPI = require('./api/v1/client/profile');
const ViewServiceAPI = require('./api/v1/service/index');
const ServiceGeneralAPI = require('./api/v1/service/general');
const reviewCRUDAPI = require('./api/v1/service/review');
const businessProfileAPI = require('./api/v1/business/profile');


module.exports = (app) => {
  /**
   * Visitor Routes.
   */
  app.use('/api/v1/service', ViewServiceAPI);
  app.use('/api/v1/business', ViewBussinessAPI);
  app.use('/api/v1/service/category', ServiceGeneralAPI);
  app.use('/api/v1/business/category', RelatedBusinessAPI);

  /**
   * Client Routes.
   */

  app.use('/api/v1/client/auth', clientAuthAPI);
  app.use('/api/v1/client/profile', clientProfileAPI);

  /**
   * Business Routes.
   */

  app.use('/api/v1/business/auth', businessAuthAPI);
  app.use('/api/v1/business/profile', businessProfileAPI);
  app.use('/api/v1/business', businessAPI);

  /**
   * Admin Routes.
   */

  app.use('/api/v1/admin/auth', adminAuthAPI);

  /**
   * Service Routes.
   */

  app.use('/api/v1/service', reviewCRUDAPI);
};
