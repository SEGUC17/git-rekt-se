import axios from 'axios';
import { Client } from '../services/EndPoints';

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
  login(data, callBack) {
    axios
      .post(Client().login, data)
      .then((response) => {
        this.user.authenticated = true;
        localStorage.setItem('client_token', response.data.token);
        localStorage.setItem('client_email', response.data.email);
        localStorage.setItem('client_id', response.data.id);
        return callBack(null, response.data);
      })
      .catch((err) => {
        callBack(err, null);
      });
  },
  logout(callBack) {
    axios.post(Client().logout, null, {
      headers: {
        Authorization: this.getJWTtoken(),
      },
    }).then((response) => {
      this.user.authenticated = false;
      localStorage.removeItem('client_token', response.data.token);
      localStorage.removeItem('client_email', response.data.email);
      localStorage.removeItem('client_id', response.data.id);
      callBack(null, response.data);
    }).catch((err) => {
      callBack(err, null);
    });
  },
  getJWTtoken() {
    return `JWT ${localStorage.getItem('client_token')}`;
  },
};
