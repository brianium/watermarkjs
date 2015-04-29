/**
 * Get the data url of a canvas
 *
 * @param {HTMLCanvasElement}
 * @return {String}
 */
export function dataUrl(canvas) {
  return canvas.toDataURL();
}
