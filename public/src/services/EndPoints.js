/**
 * This contains some utility functions for all the API routes for the Back-End.
 */

/**
 * The Base URL.
 * @constant
 * @type {string}
 */

const BASE = 'http://localhost:3000/api/v1';

/**
 * A Function returning all routes for the Visitor.
 * @returns {Object}
 */
export const Visitor = () => ({
  search: `${BASE}/visitor/search/`,
  topRated: `${BASE}/toprated`,
  viewService: serviceID => `${BASE}/service/${serviceID}`,
  relatedService: (serviceID, offset) => `${BASE}/service/category/${serviceID}/${offset}`,
  relatedBusiness: (businessID, offset) => `${BASE}/business/category/${businessID}/${offset}`,
  locations: `${BASE}/visitor/search/locations`,
  viewBusiness: businessID => `${BASE}/business/${businessID}`,
  businessCategories: `${BASE}/categories/business`,
});

/**
 * A Function returning all routes for the Client.
 * @returns {Object}
 */
export const Client = () => {
  const authBase = `${BASE}/client/auth`;
  const profileBase = `${BASE}/client/profile`;
  const reviewBase = `${BASE}/client/review`;
  return {
    finalizeFb: `${authBase}/fb/finalize/login`,
    login: `${authBase}/login`,
    facebookRedirect: `${BASE}/client/auth/fb/login`,
    signup: `${authBase}/signup`,
    resend: `${authBase}/confirmation/send`,
    reset: `${authBase}/reset`,
    forgot: `${authBase}/forgot`,
    logout: `${authBase}/logout`,
    confirmEmail: token => `${authBase}/confirmation/${token}/confirm`,
    reportReview: reviewID => `${reviewBase}/report/${reviewID}`,
    editInfo: clientID => `${profileBase}/${clientID}/edit`,
    getBookings: `${profileBase}/bookings/history`,
    getInfo: clientID => `${profileBase}/${clientID}`,
  };
};

/**
 * A Function returning all routes for the Business.
 * @returns {Object}
 */
export const Business = () => {
  const authBase = `${BASE}/business/auth`;
  const serviceBase = `${BASE}/business/service`;
  const businessBase = `${BASE}/business/info`;
  const galleryBase = `${BASE}/business/gallery`;
  return {
    unverfiedSignUp: `${authBase}/unverified/signup`,
    login: `${authBase}/verified/login`,
    forgot: `${authBase}/forgot`,
    reset: `${authBase}/reset`,
    logout: `${authBase}/logout`,
    verifiedSignUp: token => `${authBase}/confirm/signup/${token}`,

    getBasicInfo: `${BASE}/business/profile/profile`,
    editBasicInfo: businessID => `${BASE}/business/profile/${businessID}/edit`,
    editInfo: `${businessBase}/edit`,
    addBranch: `${businessBase}/add/branches`,
    editBranch: (businessID, branchID) => `${businessBase}/${businessID}/edit/branch/${branchID}`,
    deleteBranch: (businessID, branchID) => `${businessBase}/${businessID}/delete/branch/${branchID}`,

    listServices: `${serviceBase}/list`,
    listCategories: `${serviceBase}/category/list`,
    listOfferings: serviceID => `${serviceBase}/${serviceID}/offering/list`,
    listBranches: `${serviceBase}/branch/list`,
    createService: `${serviceBase}/create`,
    editService: serviceID => `${serviceBase}/${serviceID}/edit`,
    deleteService: serviceID => `${serviceBase}/${serviceID}/delete`,
    createOffering: serviceID => `${serviceBase}/${serviceID}/offering/create`,
    editOffering: (serviceID, offeringID) => `${serviceBase}/${serviceID}/offering/${offeringID}/edit`,
    deleteOffering: (serviceID, offeringID) => `${serviceBase}/${serviceID}/offering/${offeringID}/delete`,

    viewGallery: `${galleryBase}/list`,
    addImage: `${galleryBase}/add`,
    editImage: imageID => `${galleryBase}/edit/${imageID}`,
    deleteImage: imageID => `${galleryBase}/delete/${imageID}`,

    businessInfo: `${businessBase}/general`,
    businessbranches: `${businessBase}/branches`,
    getTransactions: `${BASE}/business/profile/transactions`,
    acceptTransaction: `${BASE}/business/profile/transactions/accept`,
    refundTransaction: `${BASE}/business/profile/transactions/reject`,
  };
};

/**
 * A Function returning all routes for the Admin.
 * @returns {Object}
 */
export const Admin = () => {
  const generalBase = `${BASE}/admin/general`;
  const categoryBase = `${BASE}/admin/category`;
  const clientBase = `${BASE}/admin/client`;
  const businessBase = `${BASE}/admin/business`;

  return {
    login: `${BASE}/admin/auth/login`,
    logout: `${BASE}/admin/auth/logout`,

    viewBusiness: `${generalBase}/business`,
    acceptBusiness: businessID => `${generalBase}/confirm/${businessID}`,
    denyBusiness: businessID => `${generalBase}/deny/${businessID}`,

    createCategory: `${categoryBase}/add`,
    editCategory: categoryID => `${categoryBase}/edit/${categoryID}`,
    deleteCategory: categoryID => `${categoryBase}/delete/${categoryID}`,
    listCategories: `${categoryBase}/list`,
    listClients: `${clientBase}/list`,
    deleteClient: clientID => `${clientBase}/delete/${clientID}`,
    deleteBusiness: businessID => `${businessBase}/delete/${businessID}`,
    listBusiness: `${businessBase}/list`,
  };
};

/**
 * A Function returning all routes for the Service.
 * @returns {Object}
 */
export const Service = () => {
  const serviceBase = `${BASE}/service`;
  const bookingBase = `${BASE}/service/book`;
  return {
    createReview: serviceID => `${serviceBase}/${serviceID}/review`,
    editReview: (serviceID, reviewID) => `${serviceBase}/${serviceID}/review/${reviewID}/edit`,
    deleteReview: (serviceID, reviewID) => `${serviceBase}/${serviceID}/review/${reviewID}/delete`,

    viewGallery: serviceID => `${serviceBase}/${serviceID}/gallery`,
    addImage: serviceID => `${serviceBase}/${serviceID}/gallery/add`,
    editImage: (serviceID, imageID) => `${serviceBase}/${serviceID}/gallery/edit/${imageID}`,
    deleteImage: (serviceID, imageID) => `${serviceBase}/${serviceID}/gallery/delete/${imageID}`,

    viewService: serviceID => `${serviceBase}/${serviceID}`,
    viewRelatedServices: (categoryID, offset) => `${serviceBase}/category/${categoryID}/${offset}`,
    validateCoupon: `${bookingBase}/coupon/validate`,
    makeBooking: `${bookingBase}`,

    viewCoupons: serviceID => `${serviceBase}/${serviceID}/coupons`,
    addCoupon: serviceID => `${serviceBase}/${serviceID}/coupons/add`,
    deleteCoupon: (serviceID, couponID) => `${serviceBase}/${serviceID}/coupons/delete/${couponID}`,
  };
};

/**
 * Export all of them.
 */
export default {
  Client,
  Business,
  Visitor,
  Admin,
  Service,
};
