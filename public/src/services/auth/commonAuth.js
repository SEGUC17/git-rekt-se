import clientAuth from './clientAuth';
import businessAuth from './businessAuth';

export default {
  /**
   * Checks if either the business or client are logged in.
   * @returns {boolean} - true if either business or client is logged in.
   */
  isAuthenticated: () => {
    businessAuth.refreshAuth();
    clientAuth.refreshAuth();
    return businessAuth.user.authenticated || clientAuth.user.authenticated;
  },
  isBusiness: () => {
    businessAuth.refreshAuth();
    clientAuth.refreshAuth();
    return businessAuth.user.authenticated && !clientAuth.user.authenticated;
  },
};
