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
    const keys = Object.keys(data);
    keys.forEach((key) => {
      this[key] = data[key];
    }, this);
    this.errors = new Errors();
  }

  /**
   * @param {String} method
   * @param {String} url
   *
   * @memberOf Form
   */
  onSubmit(method, url) {
    axios[method](url, this);
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  get(url) {
    this.onSubmit('GET', url);
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  post(url) {
    this.onSubmit('POST', url);
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  put(url) {
    this.onSubmit('PUT', url);
  }

  /**
   * @param {String} url
   *
   * @memberOf Form
   */
  delete(url) {
    this.onSubmit('DELETE', url);
  }
}
