/**
 * Extend one object with the properties of another
 *
 * @param {Object} first
 * @param {Object} second
 * @return {Object}
 */
export function extend(first, second) {
  const secondKeys = Object.keys(second);
  secondKeys.forEach(key => first[key] = second[key]);
  return first;
}

/**
 * Create a shallow copy of the object
 *
 * @param {Object} obj
 * @return {Object}
 */
export function clone(obj) {
  return extend({}, obj);
}
