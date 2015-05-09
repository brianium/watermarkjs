/**
 * Write text to the lower right portion of the target canvas.
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @return {Function}
 */
export function lowerRight(text, font, fillStyle, alpha) {
  alpha || (alpha = 1.0);
  return function(target) {
    let context = target.getContext('2d');
    context.globalAlpha = alpha;
    context.fillStyle = fillStyle;
    context.font = font;
    let metrics = context.measureText(text);
    context.fillText(text, target.width - (metrics.width + 10), target.height - 10);
    return target;
  }
}
