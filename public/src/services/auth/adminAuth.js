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
   * An Error first callback for handling login.
   * @callback handler
   * @param {Error} error
   * @param {*} data
   */
  /**
   * Login User.
   * @param {Object} data - The data to send in the request body.
   * @param {handler} callBack - Handles/Updates the view after login fails or succeeds.
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
   * Returns the associated JWT token appended after `JWT`.
   * @returns {string} - Formated as `JWT TOKEN_HERE`.
   */
  getJWTtoken() {
    return `JWT ${localStorage.getItem('admin_token')}`;
  },

  /**
   * Refreshes the status of the user.
   */
  refreshAuth() {
    if (localStorage.getItem('admin_token')) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },

  /**
   * Return the status of the user.
   * @returns {boolean} - true if the user is authenticated, false otherwise.
   */
  isAuthenticated() {
    this.refreshAuth();
    return this.user.authenticated;
  },

};
