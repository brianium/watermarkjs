/**
 * Return a function for positioning a watermark on a target canvas.
 *
 * @param {Function} xFn - a function to determine an x value.
 * @param {Function} yFn - a function to determine a y value.
 * @param {Number} alpha
 * @return {Function}
 */
export function atPos(xFn, yFn, alpha) {
  alpha || (alpha = 1.0);
  return function (target, watermark) {
    let context = target.getContext('2d');
    context.globalAlpha = alpha;
    context.drawImage(watermark, xFn(target, watermark), yFn(target, watermark));
    return target;
  }
}


/**
 * Place the watermark in the lower right corner of the target
 * image.
 *
 * @param {Number} alpha
 * @return {Function}
 */
export function lowerRight(alpha) {
  return atPos(
    (target, mark) => target.width - (mark.width + 10),
    (target, mark) => target.height - (mark.height + 10),
    alpha
  );
}
