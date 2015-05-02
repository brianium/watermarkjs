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
  let images = new Array(urls.length), loaded = 0;

  return new Promise(resolve => {
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
 * Return a collection of images from an
 * array of File objects.
 *
 * @param {Array} files
 * @return {Array}
 */
export function fromFiles(files) {
  let images = new Array(files.length), loaded = 0;

  return new Promise(resolve => {
    for (var i = 0; i < files.length; i++) {
      let img = new Image();

      let reader = new FileReader();
      reader.onloadend = (function (index) {
        return function() {
          img.src = reader.result;
          images[index] = img;
          (++loaded === files.length) && resolve(images);
        }
      })(i);

      reader.readAsDataURL(files[i]);
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
export function mapToCanvas(images) {
  return images.map(imageToCanvas);
}
