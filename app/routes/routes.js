const ClientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const businessAPI = require('./api/v1/business/business');
const ViewBussinessAPI = require('./api/v1/business/index');
const RelatedBusinessAPI = require('./api/v1/business/related');
const AdminAuthAPI = require('./api/v1/admin/auth');
const ClientProfileAPI = require('./api/v1/client/profile');
const ViewServiceAPI = require('./api/v1/service/index');
const RelatedServiceAPI = require('./api/v1/service/related');
const reviewCRUDAPI = require('./api/v1/service/review');
const businessProfileAPI = require('./api/v1/business/profile');


module.exports = (app) => {
  /**
   * Visitor Routes.
   */

  app.use('/api/v1/service', ViewServiceAPI);
  app.use('/api/v1/business', ViewBussinessAPI);
  app.use('/api/v1/service/category', RelatedServiceAPI);
  app.use('/api/v1/business/category', RelatedBusinessAPI);

  /**
   * Client Routes.
   */

  app.use('/api/v1/client/auth', ClientAuthAPI);
  app.use('/api/v1/client/profile', ClientProfileAPI);

  /**
   * Business Routes.
   */

  app.use('/api/v1/business/auth', businessAuthAPI);
  app.use('/api/v1/business/profile', businessProfileAPI);
  app.use('/api/v1/business', businessAPI);

  /**
   * Admin Routes.
   */

  app.use('/api/v1/admin/auth', AdminAuthAPI);

  /**
   * Service Routes.
   */

  app.use('/api/v1/service', reviewCRUDAPI);
};
