import axios from 'axios';

const authBASE = 'http://localhost:3000/api/v1/client/auth';

export default {
  user: {
    authenticated: false,
  },
  login(data, callBack) {
    axios
    .post(`${authBASE}/login`, data)
    .then((response) => {
      this.user.authenticated = true;
      localStorage.setItem('JWT-token', response.data.token);
      return callBack(response, null);
    })
    .catch(err => callBack(null, err));
  },
}
;
