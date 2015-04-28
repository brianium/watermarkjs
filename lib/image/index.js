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
 * Load a collection of urls
 *
 * @param {...urls} images
 * @return {Promise}
 */
export function load(...urls) {
  let loaded = 0;
  let images = new Array(urls.length);

  return new Promise((resolve, reject) => {
    for (var i = 0; i < urls.length; i++) {
      let img = new Image();

      img.onload = (function(index) {
        return function () {
          loaded++;
          images[index] = img;
          if (loaded === urls.length) {
            resolve(images);
          }
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
export function canvas(images) {
  return images.map(imageToCanvas);
}
