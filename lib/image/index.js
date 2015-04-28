/**
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
 * Load a collection of urls. Images are loaded asynchronously,
 * but the resulting promise is resolved with the original order
 * of urls.
 *
 * @param {Array} images
 * @param {Function} before - an optional image initializer
 * @return {Promise}
 */
export function load(urls, before) {
  let images = new Array(urls.length), loaded = 0;

  return new Promise((resolve, reject) => {
    for (var i = 0; i < urls.length; i++) {
      let img = new Image();

      (typeof(before) === 'function') && before(img);

      img.onload = (function(index) {
        return function () {
          images[index] = this;
          (++loaded === urls.length) && resolve(images);
        }
      })(i);

      img.src = urls[i];
    }
  });
}

/**
 * Convert an array of image objects
 * to canvas elements.
 *
 * @param {Array} images
 * @return {Array}
 */
export function map(images) {
  return images.map(imageToCanvas);
}
