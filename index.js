require('babelify/polyfill');
import {load, mapToCanvas} from './lib/image';
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
  return {

    /**
     * Convert the watermark into a blob. The draw
     * function is given all images as canvas elements in order.
     *
     * @param {Function} draw
     * @return {Object}
     */
    asBlob(draw) {
      let newPromise = load(images, init)
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
