import {load, mapToCanvas, createImage} from './image';
import {invoker} from './functions';
import {dataUrl as mapToDataUrl} from './canvas';
import {blob as mapToBlob} from './blob';
import * as style from './style';

/**
 * Return a watermark object
 *
 * @param {Array} resources - a collection of urls, File objects, or Image objects
 * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
 * @param {Promise} promise - optional
 * @return {Object}
 */
export default function watermark(resources, init, promise) {

  promise || (promise = load(resources, init));

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
        .then(mapToCanvas)
        .then(invoker(draw))
        .then(mapToDataUrl);

      return watermark(resources, init, promise);
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

      return watermark(resources, init, promise);
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

      return watermark(resources, init, promise);
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

      return watermark(resources, init, promise);
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

      return watermark(resources, init, promise);
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
