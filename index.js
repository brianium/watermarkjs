require('babelify/polyfill');
import {load as loadUrls, mapToCanvas, fromFiles, createImage} from './lib/image';
import {invoker} from './lib/functions';
import {dataUrl as mapToDataUrl} from './lib/canvas';
import {blob as mapToBlob} from './lib/blob';

/**
 * Return a watermark object.
 *
 * @param {Array} resources - a collection of urls or File objects
 * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
 * @param {Promise} promise - optional
 * @return {Object}
 */
export function watermark(resources, init, promise) {

  let load = (typeof(resources[0]) === 'string') ? loadUrls : fromFiles;

  return {

    /**
     * Convert the watermarked image into a dataUrl. The draw
     * function is given all images as canvas elements in order.
     *
     * @param {Function} draw
     * @return {Object}
     */
    dataUrl(draw) {
      let promise = load(resources, init)
        .then(mapToCanvas)
        .then(invoker(draw))
        .then(mapToDataUrl);

      return new watermark(resources, init, promise);
    },

    /**
     * Convert the watermark into a blob.
     *
     * @param {Function} draw
     * @return {Object}
     */
    blob(draw) {
      let promise = this.dataUrl(draw)
        .then(mapToBlob);

      return watermark(resources, init, promise);
    },

    /**
     * Convert the watermark into an image
     */
    image(draw) {
      let promise = this.dataUrl(draw)
        .then(createImage);

      return watermark(resources, init, promise);
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
 * Load an array of image urls.
 *
 * @param {Array} urls
 * @param {Function} init
 * @return {Object}
 */
function urls(urls, init) {
  let promise = loadUrls(urls, init);
  return watermark(promise);
}

/**
 * Load an array of file objects.
 *
 * @param {Array} fileObjects
 * @return {Object}
 */
function files(fileObjects) {
  let promise = fromFiles(fileObjects);
  return watermark(promise);
}

/**
 * Export to browser
 */
window.watermark = watermark;
