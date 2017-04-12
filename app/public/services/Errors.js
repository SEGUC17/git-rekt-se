export default class Errors {
  /**
   * Creates an instance of Errors.
   * @param {Array} errors
   *
   * @memberOf Errors
   */
  constructor(errors = []) {
    errors.forEach((err) => {
      if (!this[err.param]) {
        this[err.param] = [];
      }
      this[err.param].push(err.msg);
    }, this);
  }

  /**
   * @param {String|Array} name
   * @param {String} message
   *
   * @memberOf Errors
   */
  append(name, message = '') {
    if (name instanceof String) {
      if (!this[name]) {
        this[name] = [];
      }
      if (message.length > 0) {
        this[name].push(message);
      }
    } else if (name instanceof Array) {
      name.forEach((error) => {
        this[error.name] = error.msg;
      }, this);
    } else {
      throw new TypeError('"name" must be either an Array or String.');
    }
  }

  /**
   * @param {String} name
   * @returns {Boolean}
   *
   * @memberOf Errors
   */
  has(name) {
    return this[name] && this[name].length > 0;
  }

  /**
   * @param {String} name
   * @returns {Array}
   *
   * @memberOf Errors
   */
  get(name) {
    return this[name];
  }

  /**
   * @param {String} name
   * @returns {String}
   *
   * @memberOf Errors
   */
  getFirst(name) {
    return this.get(name)[0];
  }

  /**
   * @returns {Boolean}
   *
   * @memberOf Errors
   */
  isEmpty() {
    const keys = Object.keys(this);
    return keys.length === 0;
  }

  /**
   * @param {String} name
   *
   * @memberOf Errors
   */
  remove(name) {
    delete this[name];
  }

  /**
   * @memberOf Errors
   */
  clear() {
    const keys = Object.keys(this);
    keys.forEach(key => this.remove(key), this);
  }
}
