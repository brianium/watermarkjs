
/**
 * Place the watermark in the lower right corner of the target
 * image.
 *
 * @param {HTMLCanvasElement} target
 * @param {HTMLCanvasElement} watermark
 * @return {HTMLCanvasElement}
 */
export function lowerRight(target, watermark) {
  let context = target.getContext('2d');
  context.drawImage(watermark, target.width - 50, target.height - 50);
  return target;
}
