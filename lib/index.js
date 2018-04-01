import {load, mapToCanvas, createImage} from './image';
import {dataUrl as mapToDataUrl} from './canvas';
import {blob as mapToBlob} from './blob';
import * as style from './style';
import {clone, extend} from './object';
import pool from './canvas/pool';

/**
 * A configuration type for the watermark function
 *
 * @typedef {Object} Options
 * @property {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
 * @property {ImageFormat} type - specify the image format to be used when retrieving result (only supports "image/png" or "image/jpeg", default "image/png")
 * @property {Number} encoderOptions - specify the image compression quality from 0 to 1 (default 0.92)
 * @property {Number} poolSize - number of canvas elements available for drawing,
 * @property {CanvasPool} pool - the pool used. If provided, poolSize will be ignored
 */

/**
 * @constant
 * @type {Options}
 */
const defaults = {
  init: () => {},
  type: 'image/png',
  encoderOptions: 0.92
}

/**
 * Merge the given options with the defaults
 *
 * @param {Options} options
 * @return {Options}
 */
function mergeOptions(options) {
  return extend(clone(defaults), options);
}

/**
 * Release canvases from a draw result for reuse. Returns
 * the dataURL from the result's canvas
 *
 * @param {DrawResult} result
 * @param {CanvasPool} pool
 * @return  {String}
 */
function release(result, pool, parameters) {
  const { canvas, sources } = result;
  const dataURL = mapToDataUrl(canvas, parameters);
  sources.forEach(pool.release);
  return dataURL;
}

/**
 * Return a watermark object
 *
 *
 * @param {Array} resources - a collection of urls, File objects, or Image objects
 * @param {Options} options - a configuration object for watermark
 * @param {Promise} promise - optional
 * @return {Object}
 */
export default function watermark(resources, options = {}, promise = null) {
  const opts = mergeOptions(options);
  promise || (promise = load(resources, opts.init));

  return {
    /**
     * Convert the watermarked image into a dataUrl. The draw
     * function is given all images as canvas elements in order
     *
     * @param {Function} draw
     * @return {Object}
     */
    dataUrl(draw) {
      const promise = this
        .then(images => mapToCanvas(images, pool))
        .then(canvases => style.result(draw, canvases))
        .then(result => release(result, pool, { type: opts.type, encoderOptions:opts.encoderOptions }));

      return watermark(resources, opts, promise);
    },

    /**
     * Load additional resources
     *
     * @param {Array} resources - a collection of urls, File objects, or Image objects
     * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
     * @return {Object}
     */
    load(resources, init) {
      const promise = this
        .then(resource => load([resource].concat(resources), init));

      return watermark(resources, opts, promise);
    },

    /**
     * Render the current state of the watermarked image. Useful for performing
     * actions after the watermark has been applied
     *
     * @return {Object}
     */
    render() {
      const promise = this
        .then(resource => load([resource]));

      return watermark(resources, opts, promise);
    },

    /**
     * Convert the watermark into a blob
     *
     * @param {Function} draw
     * @return {Object}
     */
    blob(draw) {
      const promise = this.dataUrl(draw)
        .then(mapToBlob);

      return watermark(resources, opts, promise);
    },

    /**
     * Convert the watermark into an image using the given draw function
     *
     * @param {Function} draw
     * @return {Object}
     */
    image(draw) {
      const promise = this.dataUrl(draw)
        .then(createImage);

      return watermark(resources, opts, promise);
    },

    /**
     * Delegate to the watermark promise
     *
     * @return {Promise}
     */
    then(...funcs) {
      return promise.then.apply(promise, funcs);
    }
  };
};

/**
 * Style functions
 */
watermark.image = style.image;
watermark.text = style.text;

/**
 * Clean up all canvas references
 */
watermark.destroy = () => pool.clear();
