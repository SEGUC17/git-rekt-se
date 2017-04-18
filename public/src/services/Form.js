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
   * Sets the value of a specific attribute.
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
   * Resets the values of this form unless specific attributes were given.
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
   * Returns the data of this form in JSON format.
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
   * Submits this form using the given method and url,
   * updating the forms state and return a Promise.
   * @param {String} method
   * @param {String} url
   * @returns {Promise}
   * @memberOf Form
   */
  submit(method, url) {
    this.errors.clear();
    return new Promise((resolve, reject) => {
      axios[method](url, this.data())
        .then((response) => {
          this.onSuccess(response);
          resolve(response.data);
        })
        .catch((err) => {
          this.onFailure(err);
          reject(err.response ? err.response.data.errors : err.message);
        });
    });
  }

  /**
   * Submits the form to the given url using a GET Request.
   * @param {String} url
   *
   * @memberOf Form
   */
  get(url) {
    return this.submit('get', url);
  }

  /**
   * Submits the form to the given url using a POST Request.
   * @param {String} url
   *
   * @memberOf Form
   */
  post(url) {
    return this.submit('post', url);
  }

  /**
   * Submits the form to the given url using a PUT Request.
   * @param {String} url
   *
   * @memberOf Form
   */
  put(url) {
    return this.submit('put', url);
  }

  /**
   * Submits the form to the given url using a DELETE Request.
   * @param {String} url
   *
   * @memberOf Form
   */
  delete(url) {
    return this.submit('delete', url);
  }

  /**
   * Called when request finishes successfully.
   * @param {ResponseSchema} response
   * @see {@link https://github.com/mzabriskie/axios#response-schema}
   * @memberOf Form
   */
  onSuccess(response) {
    this.reset();
  }

  /**
   * Called when request finishes with an error.
   * @param {Error} error
   * @see {@link https://github.com/mzabriskie/axios#handling-errors}
   * @memberOf Form
   */
  onFailure(error) {
    let errors;
    if (error.response) {
      errors = new Errors(error.response.data.errors);
    } else {
      errors = new Errors(error.message);
    }
    this.errors = errors;
  }
}
