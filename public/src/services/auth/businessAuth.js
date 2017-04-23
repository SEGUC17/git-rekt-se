import axios from 'axios';
import {
  Business,
} from '../../services/EndPoints';

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

  /**
   * Login User.
   * @param data The data to send in the request body.
   * @param callBack The callback to axios.
   */

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

  /**
   * Log out User.
   * @param callBack The callback to axios.
   */

  logout(callBack) {
    this.user.authenticated = false;
    const currentToken = this.getJWTtoken();

    localStorage.removeItem('business_token');
    localStorage.removeItem('business_email');
    localStorage.removeItem('business_id');

    axios.post(Business()
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

/**
 * Complete business registration.
 * @param {String} token the registration token.
 * @param {any} data the data to send with the request.
 * @param {any} callBack the callback to axios.
 */
  verifiedsignup(token, data, callBack) {
    axios
      .post(Business()
        .verifiedSignUp(token), data)
      .then(response => callBack(null, response.data))
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },
  /*
   * Get the JWT for Header.
   * */

  getJWTtoken() {
    return `JWT ${localStorage.getItem('business_token')}`;
  },

  /*
   * Refresh the status of the user.
   * */

  refreshAuth() {
    this.user.authenticated = !!localStorage.getItem('business_token');
  },

  /**
   * Return the status of the user.
   */

  isAuthenticated() {
    this.refreshAuth();
    return this.user.authenticated;
  },
};
