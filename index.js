require('babelify/polyfill');
import {load, mapToCanvas, fromFiles} from './lib/image';
import {invoker} from './lib/functions';
import {dataUrl} from './lib/canvas';
import {blob as mapToBlob} from './lib/blob';

/**
 * Return a watermark object.
 *
 * @param {Promise} promise - optional
 * @return {Object}
 */
export function watermark(promise) {

  return {

    /**
     * Convert the watermark into a blob. The draw
     * function is given all images as canvas elements in order.
     *
     * @param {Function} draw
     * @return {Object}
     */
    blob(draw) {
      let promise = this
        .then(mapToCanvas)
        .then(invoker(draw))
        .then(dataUrl)
        .then(mapToBlob);

      return watermark(promise);
    },

    /**
     * Load an array of image urls.
     *
     * @param {Array} urls
     * @param {Function} init
     * @return {Object}
     */
    urls(urls, init) {
      let promise = load(urls, init);
      return watermark(promise);
    },

    /**
     * Load an array of file objects.
     *
     * @param {Array} fileObjects
     * @return {Object}
     */
    files(fileObjects) {
      let promise = fromFiles(fileObjects);
      return watermark(promise);
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
