import axios from 'axios';
import { Client } from '../services/EndPoints';

export default {
  user: {
    authenticated: false,
  },
  login(data, callBack) {
    axios
      .post(Client().login, data)
      .then((response) => {
        this.user.authenticated = true;
        localStorage.setItem('client-token', response.data.token);
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
      localStorage.removeItem('client-token');
      callBack(null, response.data);
    }).catch((err) => {
      callBack(err, null);
    });
  },
  getJWTtoken() {
    return `JWT ${localStorage.getItem('client-token')}`;
  },
};
