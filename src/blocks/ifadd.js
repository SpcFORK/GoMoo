const
  /**
   * Conditionally adds a value to a target object if the value is truthy.
   * @param {Object} t - The target object.
   * @param {string} k - The key under which to add the value.
   * @param {*} v - The value to add.
   * @returns {Object} The target object.
   */
  ifAdd = (t, k, v) => (v && (t[k] = v), v),
  
  /**
   * Iterates over an object's entries and conditionally adds them to a target object if the values are truthy.
   * @param {Object} t - The target object.
   * @param {Object} obj - The source object from which to copy values.
   * @returns {Object} The target object.
   */
  ifAddAll = (t, obj) => Object.entries(obj).map(([k, v]) => ifAdd(t, k, v)),
  
  /**
   * Returns a function that conditionally adds a value to a target object if the value is truthy, bound to a specific target.
   * @param {Object} t - The target object to bind.
   * @param {string} k - The key under which to add the value.
   * @param {*} v - The value to add.
   * @returns {Function} A function that conditionally adds a value to a target object if the value is truthy.
   */
  bindIfAdd = (t) => (k, v) => ifAdd(t, k, v),
  
  /**
   * Returns a function that iterates over an object's entries and conditionally adds them to a bound target object if the values are truthy.
   * @param {Object} t - The target object to bind.
   * @param {Object} obj - The source object from which to copy values.
   * @returns {Function} A function that iterates over an object's entries and conditionally adds them to a bound target object
   */
  bindIfAddAll = (t) => (obj) => ifAddAll(t, obj)

module.exports = {
  ifAdd,
  ifAddAll,
  bindIfAdd,
  bindIfAddAll
}