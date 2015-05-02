require('babelify/polyfill');
import {load, mapToCanvas, fromFiles} from './lib/image';
import {invoker} from './lib/functions';
import {dataUrl} from './lib/canvas';
import {blob} from './lib/blob';

/**
 * Return a watermark object.
 *
 * @param {Array} images
 * @param {Function} init - optional
 * @param {Promise} promise - optional
 * @return {Object}
 */
export function watermark(images, init, promise) {

  /**
   * The function used for getting image objects. If a list of strings
   * is given, it will assume they are urls pointing to remote images. Otherwise
   * File objects are assumed.
   *
   * @param {Array} filesOrUrls
   * @return {Promise}
   */
  let getImages = typeof(images[0]) === 'string' ? load : fromFiles;

  return {

    /**
     * Convert the watermark into a blob. The draw
     * function is given all images as canvas elements in order.
     *
     * @param {Function} draw
     * @return {Object}
     */
    asBlob(draw) {
      let newPromise = getImages(images, init)
        .then(mapToCanvas)
        .then(invoker(draw))
        .then(dataUrl)
        .then(blob);

      return watermark(images, init, newPromise);
    },

    /**
     * Delegate to the watermark promise.
     *
     * @return {Promise}
     */
    then(...funcs) {
      return promise.then.apply(promise, funcs);
    }

  };
};

/**
 * Export to browser
 */
window.watermark = watermark;
