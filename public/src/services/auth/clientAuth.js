import axios from 'axios';
import { Client } from '../../services/EndPoints';

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
   * Login User.
   * @param data The data to send in the request body.
   * @param callBack The callback to axios.
   */

  login(data, callBack) {
    axios
        .post(Client()
            .login, data)
        .then((response) => {
          this.user.authenticated = true;
          localStorage.setItem('client_token', response.data.token);
          localStorage.setItem('client_email', response.data.email);
          localStorage.setItem('client_id', response.data.id);
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

  /*
   * Get the JWT for Header.
   * */

  getJWTtoken() {
    return `JWT ${localStorage.getItem('client_token')}`;
  },

  /*
   * Refresh the status of the user.
   * */

  refreshAuth() {
    this.user.authenticated = !!localStorage.getItem('client_token');
  },

  /**
   * Return the status of the user.
   */

  isAuthenticated() {
    this.refreshAuth();
    return this.user.authenticated;
  },

};
