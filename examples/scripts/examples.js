(function(exports) {

  'use strict';

  var examples = {};

  /**
   * Module Constants
   *
   * Amazon S3 policy, signature, and access key id required for client side upload.
   *
   * For more information on policy documents check out Amazon docs.
   * https://aws.amazon.com/articles/1434#policydocument
   *
   * For a helpful tool for generating the policy and signature, check out policy-signer on GitHub
   * https://github.com/brianium/policy-signer
   *
   * You will need an S3 bucket of your own for this example, but there is a free tier!
   */
   var policy = 'policy',
       signature = 'signature',
       accessKeyId = 'key';

  /**
   * Set the crossOrigin attribute of an Image object to anonymous. Enables
   * a cross domain request of an image.
   *
   * @param {Image} img
   */
  examples.crossOrigin = function crossOrigin(img) {
    img.crossOrigin = 'anonymous';
  };

  /**
   * Position a watermark in the lower right corner of the target image.
   *
   * @param {HTMLCanvasElement} target
   * @param {HTMLCanvasElement} watermark
   * @return {HTMLCanvasElement}
   */
  examples.lowerRight = function lowerRight(target, watermark) {
    var context = target.getContext('2d');
    context.drawImage(watermark, target.width - watermark.width, target.height - watermark.width);
    return target;
  };

  /**
   * Return a function capable of updating a progress bar.
   *
   * @param {HTMLProgressElement}
   * @return {Function}
   */
  examples.progressHandler = function progressHandler(progressBar) {
    return function(e) {
      if (e.lengthComputable) {
        progressBar.value = (e.loaded / e.total) * 100;
      }
    }
  };

  /**
   * Return a function that inserts the composite image.
   */
  examples.completeHandler = function completeHandler(image, key) {
    return function() {
      /**
       * not sure why this is necessary, but without a small timeout there are occasional
       * 403 responses from S3
       */
      setTimeout(function(){
        image.src = 'https://s3-us-west-2.amazonaws.com/watermarkjs/' + key;
      }, 250);
    };
  };

  /**
   * Return a FormData object ready for uploading to S3.
   *
   * @param {Blob} blob
   * @param {String} key
   * @return {FormData}
   */
  examples.getFormData = function getFormData(blob, key) {
    var fd = new FormData(),
        params = {
          key: key,
          AWSAccessKeyId: accessKeyId,
          acl: 'private',
          policy: policy,
          signature: signature,
          'Content-Type': '$Content-Type',
          file: [blob, 'watermark.png']
        };

    for (var k in params) {
      var args = Array.isArray(params[k]) ? params[k] : [params[k]];
      fd.append.apply(fd, [k].concat(args));
    }

    return fd;
  };

  /**
   * Upload the watermarked image to S3
   *
   * @param {Blob} blob
   */
  examples.upload = function upload(blob) {
    var req = new XMLHttpRequest(),
        key = "watermark-" + Date.now().toString() + '.png',
        fd = examples.getFormData(blob, key);
    req.open('POST', 'https://watermarkjs.s3.amazonaws.com/', true);
    req.upload.onprogress = examples.progressHandler(document.querySelector('progress'));
    req.upload.onload = examples.completeHandler(document.getElementById('composite'), key);
    req.send(fd);
  };

  exports.examples = examples;

})(window);
