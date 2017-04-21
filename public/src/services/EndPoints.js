const BASE = 'http://localhost:3000/api/v1';

export const Visitor = () => ({
  search: `${BASE}/visitor/search/`,
  viewService: serviceID => `${BASE}/service/${serviceID}`,
  relatedService: (serviceID, offset) => `${BASE}/service/category/${serviceID}/${offset}`,
  relatedBusiness: (businessID, offset) => `${BASE}/business/category/${businessID}/${offset}`,
  locations: `${BASE}/visitor/search/locations`,
  viewBusiness: businessID => `${BASE}/business/${businessID}`,
  businessCategories: `${BASE}/categories/business`,
});

export const Client = () => {
  const authBase = `${BASE}/client/auth`;
  const profileBase = `${BASE}/client/profile`;
  return {
    finalizeFb: `${authBase}/fb/finalize/login`,
    login: `${authBase}/login`,
    signup: `${authBase}/signup`,
    resend: `${authBase}/confirmation/send`,
    reset: `${authBase}/reset`,
    forgot: `${authBase}/forgot`,
    logout: `${authBase}/logout`,
    confirmEmail: token => `${authBase}/confirmation/${token}/confirm`,
    editInfo: clientID => `${profileBase}/${clientID}/edit`,
    getInfo: clientID => `${profileBase}/${clientID}`,
  };
};

export const Business = () => {
  const authBase = `${BASE}/business/auth`;
  const serviceBase = `${BASE}/business/service`;
  const businessBase = `${BASE}/business/info`;
  const galleryBase = `${BASE}/business`;
  return {
    unverfiedSignUp: `${authBase}/unverified/signup`,
    login: `${authBase}/verified/login`,
    forgot: `${authBase}/forgot`,
    reset: `${authBase}/reset`,
    logout: `${authBase}/logout`,
    verifiedSignUp: token => `${authBase}/confirm/signup/${token}`,

    editBasicInfo: businessID => `${BASE}/business/profile/${businessID}/edit`,
    editInfo: businessID => `${businessBase}/edit/${businessID}`,
    addBranch: businessID => `${businessBase}/${businessID}/add/branches`,
    editBranch: (businessID, branchID) => `${businessBase}/${businessID}/edit/branch/${branchID}`,
    deleteBranch: (businessID, branchID) => `${businessBase}/${businessID}/delete/branch/${branchID}`,

    createService: `${serviceBase}/create`,
    editService: serviceID => `${serviceBase}/${serviceID}/edit`,
    deleteService: serviceID => `${serviceBase}/${serviceID}/delete`,
    createOffering: serviceID => `${serviceBase}/${serviceID}/offering/create`,
    editOffering: (serviceID, offeringID) => `${serviceBase}/${serviceID}/offering/${offeringID}/edit`,
    deleteOffering: (serviceID, offeringID) => `${serviceBase}/${serviceID}/offering/${offeringID}/delete`,

    addImage: businessID => `${galleryBase}/${businessID}/gallery/add`,
  };
};

export const Admin = () => {
  const generalBase = `${BASE}/admin/general`;
  const categoryBase = `${BASE}/admin/category`;
  const clientBase = `${BASE}/admin/client`;
  return {
    login: `${BASE}/admin/auth/login`,

    viewBusiness: `${generalBase}/business`,
    acceptBusiness: businessID => `${generalBase}/confirm/${businessID}`,
    denyBusiness: businessID => `${generalBase}/deny/${businessID}`,

    createCategory: `${categoryBase}/add`,
    editCategory: categoryID => `${categoryBase}/edit/${categoryID}`,
    deleteCategory: categoryID => `${categoryBase}/delete/${categoryID}`,
    listCategories: `${categoryBase}/list`,
    listClients: `${clientBase}/list`,
    deleteClient: clientID => `${clientBase}/delete/${clientID}`,
  };
};

export const Service = () => {
  const serviceBase = `${BASE}/service`;
  const bookingBase = `${BASE}/service/book`;
  return {
    createReview: serviceID => `${serviceBase}/${serviceID}/review`,
    updateReview: (serviceID, reviewID) => `${serviceBase}/${serviceID}/review/${reviewID}/edit`,
    deleteReview: (serviceID, reviewID) => `${serviceBase}/${serviceID}/review/${reviewID}/delete`,

    addImage: serviceID => `${serviceBase}/${serviceID}/gallery/add`,

    validateCoupon: `${bookingBase}/coupon/validate`,
    makeBooking: `${bookingBase}`,

    viewCoupons: serviceID => `${serviceBase}/${serviceID}/coupons`,
    addCoupon: serviceID => `${serviceBase}/${serviceID}/coupons/add`,
    deleteCoupon: (serviceID, couponID) => `${serviceBase}/${serviceID}/coupons/delete/${couponID}`,
  };
};

export default {
  Client,
  Business,
  Visitor,
  Admin,
  Service,
};
