const BASE = 'http://localhost:3000/api/v1';

export default {
  Visitor() {
    return {
      search: `${BASE}/visitor/search/`,
      viewService: serviceID => `${BASE}/service/${serviceID}`,
      relatedService: (serviceID, offset) => `${BASE}/service/category/${serviceID}/${offset}`,
      relatedBusiness: (businessID, offset) => `${BASE}/business/category/${businessID}/offset`,
      viewBusiness: businessID => `${BASE}/business/${businessID}`,
    };
  },
  Client() {
    const authBase = `${BASE}/client/auth`;
    const profileBase = `${BASE}/client/profile`;
    return {
      login: `${authBase}/login`,
      signup: `${authBase}/signup`,
      resend: `${authBase}/confirmation/send`,
      reset: `${authBase}/reset`,
      forgot: `${authBase}/forgot`,
      logout: `${authBase}/logout`,
      confirmEmail: token => `${authBase}/confirmation/${token}/confirm`,

      editInfo: clientID => `${profileBase}/${clientID}/edit`,
    };
  },
};
