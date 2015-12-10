/**
 * Return a function for positioning a watermark on a target canvas
 *
 * @param {Function} xFn - a function to determine an x value
 * @param {Function} yFn - a function to determine a y value
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha
 * @return {Function}
 */
export function atPos(xFn, yFn, text, font, fillStyle, alpha) {
  alpha || (alpha = 1.0);
  return function (target) {
    const context = target.getContext('2d');
    context.save();

    context.globalAlpha = alpha;
    context.fillStyle = fillStyle;
    context.font = font;
    let metrics = context.measureText(text);
    context.fillText(text, xFn(target, metrics, context), yFn(target, metrics, context));

    context.restore();
    return target;
  }
}

/**
 * Write text to the lower right corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
export function lowerRight(text, font, fillStyle, alpha, y) {
  return atPos(
    (target, metrics) => target.width - (metrics.width + 10),
    target => y || (target.height - 10),
    text,
    font,
    fillStyle,
    alpha
  );
}

/**
 * Write text to the lower left corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
export function lowerLeft(text, font, fillStyle, alpha, y) {
  return atPos(
    () => 10,
    target => y || (target.height - 10),
    text,
    font,
    fillStyle,
    alpha
  );
}

/**
 * Write text to the upper right corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
export function upperRight(text, font, fillStyle, alpha, y) {
  return atPos(
    (target, metrics) => target.width - (metrics.width + 10),
    () => y || 20,
    text,
    font,
    fillStyle,
    alpha
  );
}

/**
 * Write text to the upper left corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
export function upperLeft(text, font, fillStyle, alpha, y) {
  return atPos(
    () => 10,
    () => y || 20,
    text,
    font,
    fillStyle,
    alpha
  );
}

/**
 * Write text to the center of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
export function center(text, font, fillStyle, alpha, y) {
  return atPos(
    (target, metrics, ctx) => {ctx.textAlign = 'center'; return  target.width / 2;},
    (target, metrics, ctx) => {ctx.textBaseline = 'middle'; return target.height / 2; },
    text,
    font,
    fillStyle,
    alpha
  );
}
