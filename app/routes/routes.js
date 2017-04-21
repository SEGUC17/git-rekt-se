const AdminAuthAPI = require('./api/v1/admin/auth');
const AdminConfirmAPI = require('./api/v1/admin/verify');
const AdminBusinessAPI = require('./api/v1/admin/businessRemoval');
const ClientAuthAPI = require('./api/v1/client/auth');
const BusinessAuthAPI = require('./api/v1/business/auth');
const BusinessEditInformationAPI = require('./api/v1/business/editinformation');
const RelatedBusinessAPI = require('./api/v1/business/related');
const ClientProfileAPI = require('./api/v1/client/profile');
const ViewServiceAPI = require('./api/v1/service/index');
const RelatedServiceAPI = require('./api/v1/service/related');
const businessProfileAPI = require('./api/v1/business/profile');
const businessServiceAPI = require('./api/v1/business/serviceCRUD');
const ServiceGalleryAPI = require('./api/v1/service/gallery');
const ServiceBookingAPI = require('./api/v1/service/booking');
const ReviewCRUDAPI = require('./api/v1/service/review');
const AdminCatAPI = require('./api/v1/admin/category');
const BusinessGalleryAPI = require('./api/v1/business/gallery');
const VisitorSearchAPI = require('./api/v1/visitor/search');
const ViewBussinessAPI = require('./api/v1/business/index');
const BusinessCategoriesAPI = require('./api/v1/business/categories');

module.exports = (app) => {
  /**
   * Visitor Routes.
   */
  app.use('/api/v1/visitor/search', VisitorSearchAPI);
  app.use('/api/v1/service', ViewServiceAPI);
  app.use('/api/v1/service/category', RelatedServiceAPI);
  app.use('/api/v1/business/category', RelatedBusinessAPI);
  app.use('/api/v1/business', ViewBussinessAPI);
  app.use('/api/v1/categories', BusinessCategoriesAPI);

  /**
   * Client Routes.
   */

  app.use('/api/v1/client/auth', ClientAuthAPI);
  app.use('/api/v1/client/profile', ClientProfileAPI);

  /**
   * Business Routes.
   */
  app.use('/api/v1/business/service', businessServiceAPI);
  app.use('/api/v1/business/auth', BusinessAuthAPI);
  app.use('/api/v1/business/profile', businessProfileAPI);
  app.use('/api/v1/business/info', BusinessEditInformationAPI);
  app.use('/api/v1/business', BusinessGalleryAPI);

  /**
   * Admin Routes.
   */

  app.use('/api/v1/admin/business', AdminBusinessAPI);
  app.use('/api/v1/admin/auth', AdminAuthAPI);
  app.use('/api/v1/admin/general', AdminConfirmAPI);
  app.use('/api/v1/admin/category', AdminCatAPI);

  /**
   * Service Routes.
   */
  app.use('/api/v1/service', ReviewCRUDAPI);
  app.use('/api/v1/service', ServiceGalleryAPI);
  app.use('/api/v1/service/book', ServiceBookingAPI);
};
