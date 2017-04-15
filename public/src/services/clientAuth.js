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
        return callBack(null, response.data);
      })
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },
  confirmEmail(token, callBack) {
    axios
      .post(`${authBASE}/confirmation/${token}/confirm`)
      .then(response => callBack(null, response.data))
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },
  logout() {
    this.user.authenticated = false;
    localStorage.removeItem('JWT-token');
  },
  getJWTtoken() {
    return `JWT ${localStorage.getItem('JWT-token')}`;
  },
};
