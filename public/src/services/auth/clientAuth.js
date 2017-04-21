import axios from 'axios';
import {
  Client,
} from '../../services/EndPoints';

export default {
  user: {
    authenticated: false,
    userID() {
      return localStorage.getItem('client_id');
    },
    userEmail() {
      return localStorage.getItem('client_email');
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
      .post(Client()
        .login, data)
      .then((response) => {
        this.user.authenticated = true;
        this.storeData(response);
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
   * Confirm Client Email.
   * @param {string} token - The confirmation token.
   * @param {handler} callBack - Handles/Updates the view after confirmation fails or succeeds.
   */
  confirmEmail(token, callBack) {
    axios
      .post(Client()
        .confirmEmail(token))
      .then(response => callBack(null, response.data))
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

    localStorage.removeItem('client_token');
    localStorage.removeItem('client_email');
    localStorage.removeItem('client_id');

    axios.post(Client()
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
   * Returns the JWT Token in a format to be used
   * in the Request's Authorization Header.
   * @returns {string} - In the format `JWT TOKEN_HERE`
   */
  getJWTtoken() {
    return `JWT ${localStorage.getItem('client_token')}`;
  },

  /**
   * Refreshes the user's status.
   */
  refreshAuth() {
    this.user.authenticated = !!localStorage.getItem('client_token');
  },

  /**
   * Stores the data using the Browser's localStorage.
   * @param {ResponseSchema} response - Axios Response Object.
   * @see {@link https://github.com/mzabriskie/axios#response-schema}
   */
  storeData(response) {
    localStorage.setItem('client_token', response.data.token);
    localStorage.setItem('client_email', response.data.email);
    localStorage.setItem('client_id', response.data.id);
  },

  /**
   * Return whether the user is authenticated or no.
   * @returns {boolean} - true if user authenticated, false otherwise.
   */
  isAuthenticated() {
    this.refreshAuth();
    return this.user.authenticated;
  },
};
