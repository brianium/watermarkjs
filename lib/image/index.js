/**
 * Used for loading image resources asynchronously and maintaining
 * the supplied order of arguments.
 *
 * @param {Array} resources - an array of strings or blobs
 * @param {Function} invoked to return a promise
 * @param {Function} a constructor function for creating an event emitting object
 * @return {Promise}
 */
function asyncLoad(resources, cb, eventEmitter) {
  let promises = [];
  for (var i = 0; i < resources.length; i++) {
    let image = new Image();
    let emitter = eventEmitter ? new eventEmitter() : image;
    let promise = cb(emitter, i, image);
    promises.push(promise);
  }
  return Promise.all(promises);
}

/**
 * Set the src of an image object and call the resolve function.
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
 * Create a new image, optionally configuring it's onload behavior.
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
 * Load a collection of urls. Images are loaded asynchronously,
 * but the resulting promise is resolved with the original order
 * of urls.
 *
 * @param {Array} urls
 * @param {Function} before - an optional image initializer
 * @return {Promise}
 */
export function load(urls, before) {
  return asyncLoad(urls, function(img, index) {
    (typeof(before) === 'function') && before(img);
    return new Promise(resolve => {
      img.onload = () => resolve(img)
      img.src = urls[index];
    });
  });
}

/**
 * Return a collection of images from an
 * array of File objects.
 *
 * @param {Array} files
 * @return {Array}
 */
export function fromFiles(files) {
  return asyncLoad(files, function(reader, index, img) {
    return new Promise(resolve => {
      reader.onloadend = () => setAndResolve(img, reader.result, resolve);
      reader.readAsDataURL(files[index]);
    });
  }, FileReader);
}

/**
 * Convert an Image object to a canvas.
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
 * to canvas elements.
 *
 * @param {Array} images
 * @return {Array}
 */
export function mapToCanvas(images) {
  return images.map(imageToCanvas);
}
