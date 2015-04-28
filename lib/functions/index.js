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
