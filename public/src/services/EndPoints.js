const BASE = 'http://localhost:3000/api/v1';

export default {
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
