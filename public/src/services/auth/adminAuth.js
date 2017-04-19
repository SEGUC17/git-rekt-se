import axios from 'axios';
import { Admin } from '../../services/EndPoints';

export default {
  user: {
    authenticated: false,
    userID() {
      return localStorage.getItem('admin_id');
    },
    userEmail() {
      return localStorage.getItem('admin_email');
    },
  },
  login(data, callBack) {
    axios
      .post(Admin().login, data)
      .then((response) => {
        this.user.authenticated = true;
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_email', response.data.email);
        localStorage.setItem('admin_id', response.data.id);
        return callBack(null, response.data);
      })
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },
  getJWTtoken() {
    return `JWT ${localStorage.getItem('client_token')}`;
  },
  refreshAuth() {
    if (localStorage.getItem('client_token')) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },
};
