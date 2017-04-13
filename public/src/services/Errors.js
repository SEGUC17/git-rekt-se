export default class Errors {
  /**
   * Creates an instance of Errors.
   * Each error message is associated an attribute.
   * Errors that are not associated with attributes (example: JWT Errors),
   * are mapped with serverErrors.
   * @param {Array} errors
   *
   * @memberOf Errors
   */
  constructor(errors = []) {
    errors.forEach((err) => {
      this._add(err);
    }, this);
  }

  /**
   * Adds an error to the current list.
   * @param {String|Array} name
   * @param {String} message
   * @throws {TypeError} If name is neither an Array or a String.
   * @memberOf Errors
   */
  add(name, message = '') {
    if (typeof name === 'string') {
      if (!this[name]) {
        this[name] = [];
      }
      if (message.length > 0) {
        this[name].push(message);
      }
    } else if (name instanceof Array) {
      name.forEach((error) => {
        this._add(error);
      }, this);
    } else {
      throw new TypeError('"name" must be either an Array or String.');
    }
  }

  /**
   * Adds an error to the current list.
   * @param {String|Array} error
   * @throws {TypeError} If error is neither an Array or a String.
   * @private
   * @memberOf Errors
   */
  _add(error) {
    if (Object.prototype.hasOwnProperty.call(error, 'msg') &&
      Object.prototype.hasOwnProperty.call(error, 'param')) {
      if (!this[error.param]) {
        this[error.param] = [];
      }
      if (error.msg.length > 0) {
        this[error.param].push(error.msg);
      }
    } else if (typeof error === 'string') {
      if (!Object.prototype.hasOwnProperty.call(this, 'serverError')) {
        this.serverError = [];
      }
      if (error.length > 0) {
        this.serverError.push(error);
      }
    } else {
      throw new TypeError('Must be either an error thrown by "express-validator" or a String');
    }
  }

  /**
   * Checks if an error for a specific attribute exists.
   * @param {String} name
   * @returns {Boolean}
   *
   * @memberOf Errors
   */
  has(name) {
    return this[name] && this[name].length > 0;
  }

  /**
   * Retrieves the error list associated with the given attribute.
   * @param {String} name
   * @returns {Array}
   *
   * @memberOf Errors
   */
  get(name) {
    if (!this.has(name)) {
      return null;
    }
    return this[name];
  }

  /**
   * Retrieves the first error associated with the given attribute.
   * @param {String} name
   * @returns {String}
   *
   * @memberOf Errors
   */
  getFirst(name) {
    if (!this.has(name)) {
      return null;
    }
    return this.get(name)[0];
  }

  /**
   * Checks if we have any error or no.
   * @returns {Boolean}
   *
   * @memberOf Errors
   */
  isEmpty() {
    const keys = Object.keys(this);
    return keys.length === 0;
  }

  /**
   * Removes all errors associated with a given attribute.
   * @param {String} name
   *
   * @memberOf Errors
   */
  remove(name) {
    delete this[name];
  }

  /**
   * Clears all errors.
   * @memberOf Errors
   */
  clear() {
    const keys = Object.keys(this);
    keys.forEach(key => this.remove(key), this);
  }
}
