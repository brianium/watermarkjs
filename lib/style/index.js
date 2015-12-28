import * as img from './image';
import * as txt from './text';

/**
 * @typedef {Object} DrawResult
 * @property {HTMLCanvasElement} canvas - the end result of a draw
 * @property {HTMLCanvasElement[]} sources - the sources used in the draw
 */

export const image = img;
export const text = txt;

/**
 * Create a DrawResult by apply a list of canvas elements to a draw function
 *
 * @param {Function} draw - the draw function used to create a DrawResult
 * @param {HTMLCanvasElement} sources - the canvases used by the draw function
 * @return {DrawResult}
 */
export function result(draw, sources) {
  const canvas = draw.apply(null, sources);
  return {
    canvas,
    sources
  };
}
