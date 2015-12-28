/**
 * Return a function that executes a sequence of functions from left to right,
 * passing the result of a previous operation to the next
 *
 * @param {...funcs}
 * @return {Function}
 */
export function sequence(...funcs) {
  return function(value) {
    return funcs.reduce((val, fn) => fn.call(null, val), value);
  }
}

/**
 * Return the argument passed to it
 *
 * @param {Mixed} x
 * @return {Mixed}
 */
export function identity(x) {
  return x;
}
