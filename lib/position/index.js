
/**
 * Place the watermark in the lower right corner of the target
 * image.
 *
 * @param {Number} alpha
 * @return {Function}
 */
export function lowerRight(alpha) {
  alpha || (alpha = 1.0);
  return function(target, watermark) {
    var context = target.getContext('2d');
    context.globalAlpha = alpha;
    context.drawImage(watermark, target.width - (watermark.width + 10), target.height - (watermark.height + 10));
    return target;
  }
};
