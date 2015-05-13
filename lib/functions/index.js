/**
 * Returns a function that invokes the given function
 * with an array of arguments
 *
 * @param {Function} fn
 * @return {Function}
 */
export function invoker(fn) {
  return function(args) {
    return fn.apply(null, args);
  };
}

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
