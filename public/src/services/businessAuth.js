import axios from 'axios';
import { Business } from '../services/EndPoints';

export default {
  verifiedsignup(token, data, callBack) {
    axios
      .post(Business().verifiedSignUp(token), data)
      .then(response => callBack(null, response.data))
      .catch((err) => {
        callBack(err.response.data, null);
      });
  },
};
