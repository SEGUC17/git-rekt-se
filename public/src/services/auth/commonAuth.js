import clientAuth from './clientAuth';
import businessAuth from './businessAuth';

export default {
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
