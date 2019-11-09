/**
 * Get the data url of a canvas
 *
 * @param {HTMLCanvasElement}
 * @param {Paramters} Specifications according to HTMLCanvasElement.toDataURL() Documentation
 * @return {String}
 */
export function dataUrl(canvas, parameters = { type:'image/png', encoderOptions:0.92 }) {
  return canvas.toDataURL(parameters.type, parameters.encoderOptions);
}
