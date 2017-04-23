import axios from 'axios';
import {
  Admin,
} from '../../services/EndPoints';

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

  /**
   * Login User.
   * @param data The data to send in the request body.
   * @param callBack The callback to axios.
   */

  login(data, callBack) {
    axios
      .post(Admin()
        .login, data)
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

  /**
   * Logout User.
   * @param {any} callBack The callback to axios.
   */

  logout(callBack) {
    this.user.authenticated = false;
    const currentToken = this.getJWTtoken();

    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_id');

    axios.post(Admin()
        .logout, null, {
          headers: {
            Authorization: currentToken,
          },
        })
      .then((response) => {
        callBack(null, response.data);
      })
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },

  /*
   * Get the JWT for Header.
   * */

  getJWTtoken() {
    return `JWT ${localStorage.getItem('admin_token')}`;
  },

  /*
   * Refresh the status of the user.
   * */

  refreshAuth() {
    if (localStorage.getItem('admin_token')) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },

  /**
   * Return the status of the user.
   */

  isAuthenticated() {
    this.refreshAuth();
    return this.user.authenticated;
  },

};
