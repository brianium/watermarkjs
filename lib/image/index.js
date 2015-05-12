import {identity} from '../functions'

/**
 * Set the src of an image object and call the resolve function
 *
 * @param {Image} img
 * @param {String} src
 * @param {Function} resolve
 */
function setAndResolve(img, src, resolve) {
  img.src = src;
  resolve(img);
}

/**
 * Given a resource, return an appropriate loading function for it's type
 *
 * @param {String|File|Image} resource
 * @return {Function}
 */
export function getLoader(resource) {
  let type = typeof(resource);

  if (type === 'string') {
    return loadUrl;
  }

  if (resource instanceof Image) {
    return identity;
  }

  return loadFile;
}

/**
 * Used for loading image resources asynchronously and maintaining
 * the supplied order of arguments
 *
 * @param {Array} resources - a mixed array of urls, File objects, or Image objects
 * @param {Function} init - called at the beginning of resource initialization
 * @return {Promise}
 */
export function load(resources, init) {
  let promises = [];
  for (var i = 0; i < resources.length; i++) {
    let resource = resources[i];
    let loader = getLoader(resource);
    let promise = loader(resource, init);
    promises.push(promise);
  }
  return Promise.all(promises);
}

/**
 * Load an image by its url
 *
 * @param {String} url
 * @param {Function} init - an optional image initializer
 * @return {Promise}
 */
export function loadUrl(url, init) {
  let img = new Image();
  (typeof(init) === 'function') && init(img);
  return new Promise(resolve => {
    img.onload = () => resolve(img)
    img.src = url;
  });
}

/**
 * Return a collection of images from an
 * array of File objects
 *
 * @param {File} file
 * @return {Promise}
 */
export function loadFile(file) {
  let reader = new FileReader();
  return new Promise(resolve => {
    let img = new Image();
    reader.onloadend = () => setAndResolve(img, reader.result, resolve);
    reader.readAsDataURL(file);
  });
}

/**
 * Create a new image, optionally configuring it's onload behavior
 *
 * @param {String} url
 * @param {Function} onload
 * @return {Image}
 */
export function createImage(url, onload) {
  let img = new Image();
  if (typeof(onload) === 'function') {
    img.onload = onload;
  }
  img.src = url;
  return img;
}

/**
 * Convert an Image object to a canvas
 *
 * @param {Image} img
 * @return {HTMLCanvasElement}
 */
export function imageToCanvas(img) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

/**
 * Convert an array of image objects
 * to canvas elements
 *
 * @param {Array} images
 * @return {Array}
 */
export function mapToCanvas(images) {
  return images.map(imageToCanvas);
}
