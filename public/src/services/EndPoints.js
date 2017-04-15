const BASE = 'http://localhost:3000/api/v1';

export default {
  Client() {
    const authBase = `${BASE}/client/auth`;
    const profileBase = `${BASE}/client/profile`;
    return {
      signup: `${authBase}/signup`,
      resend: `${authBase}/confirmation/send`,
      forgot: `${authBase}/forgot`,
    };
  },
};
