/**
 * Returns a function that invokes the given function
 * with an array of arguments.
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
 * passing the result of a previous operation to the next.
 *
 * @param {...funcs}
 * @return {Function}
 */
export function sequence(...funcs) {
  return function(value) {
    for (var fn of funcs) {
      value = fn.call(null, value);
    }
    return value;
  }
}
