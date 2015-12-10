/**
 * Return a function for positioning a watermark on a target canvas
 *
 * @param {Function} xFn - a function to determine an x value
 * @param {Function} yFn - a function to determine a y value
 * @param {Number} alpha
 * @return {Function}
 */
export function atPos(xFn, yFn, alpha) {
  alpha || (alpha = 1.0);
  return function (target, watermark) {
    const context = target.getContext('2d');
    context.save();

    context.globalAlpha = alpha;
    context.drawImage(watermark, xFn(target, watermark), yFn(target, watermark));

    context.restore();
    return target;
  }
}


/**
 * Place the watermark in the lower right corner of the target
 * image
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

/**
 * Place the watermark in the upper right corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
export function upperRight(alpha) {
  return atPos(
    (target, mark) => target.width - (mark.width + 10),
    (target, mark) => 10,
    alpha
  );
}

/**
 * Place the watermark in the lower left corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
export function lowerLeft(alpha) {
  return atPos(
    (target, mark) => 10,
    (target, mark) => target.height - (mark.height + 10),
    alpha
  );
}

/**
 * Place the watermark in the upper left corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
export function upperLeft(alpha) {
  return atPos(
    (target, mark) => 10,
    (target, mark) => 10,
    alpha
  );
}

/**
 * Place the watermark in the center of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
export function center(alpha) {
  return atPos(
    (target, mark) => (target.width - mark.width) / 2,
    (target, mark) => (target.height - mark.height) / 2,
    alpha
  );
}
