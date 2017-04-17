import axios from 'axios';
import {
  Business,
} from '../services/EndPoints';

export default {
  user: {
    authenticated: false,
    userID() {
      return localStorage.getItem('business_id');
    },
    userEmail() {
      return localStorage.getItem('business_email');
    },
  },
  login(data, callBack) {
    axios
      .post(Business()
        .login, data)
      .then((response) => {
        this.user.authenticated = true;
        localStorage.setItem('business_token', response.data.token);
        localStorage.setItem('business_email', response.data.email);
        localStorage.setItem('business_id', response.data.id);
        return callBack(null, response.data);
      })
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },
  logout(callBack) {
    axios.post(Business()
        .logout, null, {
          headers: {
            Authorization: this.getJWTtoken(),
          },
        })
      .then((response) => {
        this.user.authenticated = false;
        localStorage.removeItem('business_token');
        localStorage.removeItem('business_email');
        localStorage.removeItem('business_id');
        return callBack(null, response.data);
      })
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },
  getJWTtoken() {
    return `JWT ${localStorage.getItem('business_token')}`;
  },
  refreshAuth() {
    if (localStorage.getItem('business_token')) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },
};
