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
}
