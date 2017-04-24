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
   * An Error first callback for handling login.
   * @callback handler
   * @param {Error} error
   * @param {*} data
   */

  /**
   * Log out User.
   * @param {handler} callBack - Handles/Updates the view after logout fails or succeeds.
   */
  logout(callBack) {
    this.user.authenticated = false;
    const currentToken = this.getJWTtoken();

    this.removeData();

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
   * An Error first callback for handling login.
   * @callback handler
   * @param {Error} error
   * @param {*} data
   */

 /**
  * Complete business registration.
  * @param {String} token - The registration token.
  * @param {*} data - The data to send with the request.
  * @param {handler} callBack - Handles/Updates the view after verification fails or succeeds.
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

  /**
  * Returns the JWT Token in a format to be used
  * in the Request's Authorization Header.
  * @returns {string} - In the format `JWT TOKEN_HERE`
  */
  getJWTtoken() {
    return `JWT ${localStorage.getItem('business_token')}`;
  },

  /**
   * Refreshes the status of the user.
   */
  refreshAuth() {
    this.user.authenticated = !!localStorage.getItem('business_token');
  },

  /**
   * Stores the data using the Browser's localStorage.
   * @param {ResponseSchema} response - Axios Response Object.
   * @see {@link https://github.com/mzabriskie/axios#response-schema}
   */
  removeData(response) {
    localStorage.removeItem('business_token');
    localStorage.removeItem('business_email');
    localStorage.removeItem('business_id');
  },

  /**
   * Returns whether the user is authenticated or no.
   * @returns {boolean} - true if user authenticated, false otherwise.
   */
  isAuthenticated() {
    this.refreshAuth();
    return this.user.authenticated;
  },
};
