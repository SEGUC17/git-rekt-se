import axios from 'axios';
import Errors from './Errors';

export default class Form {
  /**
   * Creates an instance of Form.
   * @param {Object} data
   *
   * @memberOf Form
   */
  constructor(data = {}) {
    this.keys = Object.keys(data);
    this.keys.forEach((key) => {
      this[key] = data[key];
    }, this);
    this.errors = new Errors();
  }

  /**
   * @param {String} key
   * @param {any} value
   *
   * @memberOf Form
   */
  set(key, value) {
    if (!Object.prototype.hasOwnProperty.call(this, key)) {
      throw new Error('Can only set values to keys that exist after creation!');
    }
    this[key] = value;
  }

  /**
   *
   *
   * @param {Array} keys
   *
   * @memberOf Form
   */
  reset(keys = this.keys) {
    keys.forEach((key) => {
      this[key] = '';
    }, this);
  }

  /**
   *
   *
   * @returns {Object}
   *
   * @memberOf Form
   */
  data() {
    const data = {};
    this.keys.forEach((key) => {
      data[key] = this[key];
    }, this);
    return data;
  }

  /**
   * @param {String} method
   * @param {String} url
   *
   * @memberOf Form
   */
  onSubmit(method, url) {
    this.errors.clear();
    return new Promise((resolve, reject) => {
      axios[method](url, this.data())
        .then((response) => {
          this.onSuccess(response);
          resolve(response.data, response);
        })
        .catch((err) => {
          this.onFailure(err);
          reject(err.response ? err.response.data : err.message, err);
        });
    });
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  get(url) {
    this.onSubmit('get', url);
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  post(url) {
    this.onSubmit('post', url);
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  put(url) {
    this.onSubmit('put', url);
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  delete(url) {
    this.onSubmit('delete', url);
  }

  /**
   * @param {ResponseSchema} response
   * @see {@link https://github.com/mzabriskie/axios#response-schema}
   * @memberOf Form
   */
  onSuccess(response) {
    this.reset();
  }

  /**
   * @param {Error} error
   * @see {@link https://github.com/mzabriskie/axios#handling-errors}
   * @memberOf Form
   */
  onFailure(error) {
    if (error.response) {
      this.errors.append(error.response.data);
    } else {
      this.errors.append(error.message);
    }
  }
}
