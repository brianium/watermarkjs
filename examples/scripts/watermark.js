(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.watermark = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

_dereq_('babel-register');
module.exports = _dereq_('./lib/index').default;

},{"./lib/index":6,"babel-register":10}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blob = undefined;
exports.split = split;
exports.decode = decode;
exports.uint8 = uint8;

var _functions = _dereq_('../functions');

var url = /^data:([^;]+);base64,(.*)$/;

/**
 * Split a data url into a content type and raw data
 *
 * @param {String} dataUrl
 * @return {Array}
 */
function split(dataUrl) {
  return url.exec(dataUrl).slice(1);
}

/**
 * Decode a base64 string
 *
 * @param {String} base64
 * @return {String}
 */
function decode(base64) {
  return window.atob(base64);
}

/**
 * Return a string of raw data as a Uint8Array
 *
 * @param {String} data
 * @return {UInt8Array}
 */
function uint8(data) {
  var length = data.length;
  var uints = new Uint8Array(length);

  for (var i = 0; i < length; i++) {
    uints[i] = data.charCodeAt(i);
  }

  return uints;
}

/**
 * Turns a data url into a blob object
 *
 * @param {String} dataUrl
 * @return {Blob}
 */
var blob = exports.blob = (0, _functions.sequence)(split, function (parts) {
  return [decode(parts[1]), parts[0]];
}, function (blob) {
  return new Blob([uint8(blob[0])], { type: blob[1] });
});

},{"../functions":4}],3:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataUrl = dataUrl;
/**
 * Get the data url of a canvas
 *
 * @param {HTMLCanvasElement}
 * @return {String}
 */
function dataUrl(canvas) {
  return canvas.toDataURL();
}

},{}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoker = invoker;
exports.sequence = sequence;
exports.identity = identity;
/**
 * Returns a function that invokes the given function
 * with an array of arguments
 *
 * @param {Function} fn
 * @return {Function}
 */
function invoker(fn) {
  return function (args) {
    return fn.apply(null, args);
  };
}

/**
 * Return a function that executes a sequence of functions from left to right,
 * passing the result of a previous operation to the next
 *
 * @param {...funcs}
 * @return {Function}
 */
function sequence() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function (value) {
    return funcs.reduce(function (val, fn) {
      return fn.call(null, val);
    }, value);
  };
}

/**
 * Return the argument passed to it
 *
 * @param {Mixed} x
 * @return {Mixed}
 */
function identity(x) {
  return x;
}

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLoader = getLoader;
exports.load = load;
exports.loadUrl = loadUrl;
exports.loadFile = loadFile;
exports.createImage = createImage;
exports.imageToCanvas = imageToCanvas;
exports.mapToCanvas = mapToCanvas;

var _functions = _dereq_('../functions');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * Set the src of an image object and call the resolve function
 * once it has loaded
 *
 * @param {Image} img
 * @param {String} src
 * @param {Function} resolve
 */
function setAndResolve(img, src, resolve) {
  img.onload = function () {
    return resolve(img);
  };
  img.src = src;
}

/**
 * Given a resource, return an appropriate loading function for it's type
 *
 * @param {String|File|Image} resource
 * @return {Function}
 */
function getLoader(resource) {
  var type = typeof resource === 'undefined' ? 'undefined' : _typeof(resource);

  if (type === 'string') {
    return loadUrl;
  }

  if (resource instanceof Image) {
    return _functions.identity;
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
function load(resources, init) {
  var promises = [];
  for (var i = 0; i < resources.length; i++) {
    var resource = resources[i];
    var loader = getLoader(resource);
    var promise = loader(resource, init);
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
function loadUrl(url, init) {
  var img = new Image();
  typeof init === 'function' && init(img);
  return new Promise(function (resolve) {
    img.onload = function () {
      return resolve(img);
    };
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
function loadFile(file) {
  var reader = new FileReader();
  return new Promise(function (resolve) {
    var img = new Image();
    reader.onloadend = function () {
      return setAndResolve(img, reader.result, resolve);
    };
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
function createImage(url, onload) {
  var img = new Image();
  if (typeof onload === 'function') {
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
function imageToCanvas(img) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

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
function mapToCanvas(images) {
  return images.map(imageToCanvas);
}

},{"../functions":4}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = watermark;

var _image = _dereq_('./image');

var _functions = _dereq_('./functions');

var _canvas = _dereq_('./canvas');

var _blob = _dereq_('./blob');

var _style = _dereq_('./style');

var style = _interopRequireWildcard(_style);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Return a watermark object
 *
 * @param {Array} resources - a collection of urls, File objects, or Image objects
 * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
 * @param {Promise} promise - optional
 * @return {Object}
 */
function watermark(resources, init, promise) {

  promise || (promise = (0, _image.load)(resources, init));

  return {

    /**
     * Convert the watermarked image into a dataUrl. The draw
     * function is given all images as canvas elements in order
     *
     * @param {Function} draw
     * @return {Object}
     */

    dataUrl: function dataUrl(draw) {
      var promise = this.then(_image.mapToCanvas).then((0, _functions.invoker)(draw)).then(_canvas.dataUrl);

      return watermark(resources, init, promise);
    },

    /**
     * Load additional resources
     *
     * @param {Array} resources - a collection of urls, File objects, or Image objects
     * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
     * @return {Object}
     */
    load: function load(resources, init) {
      var promise = this.then(function (resource) {
        return (0, _image.load)([resource].concat(resources), init);
      });

      return watermark(resources, init, promise);
    },

    /**
     * Render the current state of the watermarked image. Useful for performing
     * actions after the watermark has been applied
     *
     * @return {Object}
     */
    render: function render() {
      var promise = this.then(function (resource) {
        return (0, _image.load)([resource]);
      });

      return watermark(resources, init, promise);
    },

    /**
     * Convert the watermark into a blob
     *
     * @param {Function} draw
     * @return {Object}
     */
    blob: function blob(draw) {
      var promise = this.dataUrl(draw).then(_blob.blob);

      return watermark(resources, init, promise);
    },

    /**
     * Convert the watermark into an image using the given draw function
     *
     * @param {Function} draw
     * @return {Object}
     */
    image: function image(draw) {
      var promise = this.dataUrl(draw).then(_image.createImage);

      return watermark(resources, init, promise);
    },

    /**
     * Delegate to the watermark promise
     *
     * @return {Promise}
     */
    then: function then() {
      for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
      }

      return promise.then.apply(promise, funcs);
    }
  };
};

/**
 * Style functions
 */
watermark.image = style.image;
watermark.text = style.text;

},{"./blob":2,"./canvas":3,"./functions":4,"./image":5,"./style":8}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.atPos = atPos;
exports.lowerRight = lowerRight;
exports.upperRight = upperRight;
exports.lowerLeft = lowerLeft;
exports.upperLeft = upperLeft;
exports.center = center;
/**
 * Return a function for positioning a watermark on a target canvas
 *
 * @param {Function} xFn - a function to determine an x value
 * @param {Function} yFn - a function to determine a y value
 * @param {Number} alpha
 * @return {Function}
 */
function atPos(xFn, yFn, alpha) {
  alpha || (alpha = 1.0);
  return function (target, watermark) {
    var context = target.getContext('2d');
    context.save();

    context.globalAlpha = alpha;
    context.drawImage(watermark, xFn(target, watermark), yFn(target, watermark));

    context.restore();
    return target;
  };
}

/**
 * Place the watermark in the lower right corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
function lowerRight(alpha) {
  return atPos(function (target, mark) {
    return target.width - (mark.width + 10);
  }, function (target, mark) {
    return target.height - (mark.height + 10);
  }, alpha);
}

/**
 * Place the watermark in the upper right corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
function upperRight(alpha) {
  return atPos(function (target, mark) {
    return target.width - (mark.width + 10);
  }, function (target, mark) {
    return 10;
  }, alpha);
}

/**
 * Place the watermark in the lower left corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
function lowerLeft(alpha) {
  return atPos(function (target, mark) {
    return 10;
  }, function (target, mark) {
    return target.height - (mark.height + 10);
  }, alpha);
}

/**
 * Place the watermark in the upper left corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
function upperLeft(alpha) {
  return atPos(function (target, mark) {
    return 10;
  }, function (target, mark) {
    return 10;
  }, alpha);
}

/**
 * Place the watermark in the center of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
function center(alpha) {
  return atPos(function (target, mark) {
    return (target.width - mark.width) / 2;
  }, function (target, mark) {
    return (target.height - mark.height) / 2;
  }, alpha);
}

},{}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.text = exports.image = undefined;

var _image = _dereq_('./image');

var img = _interopRequireWildcard(_image);

var _text = _dereq_('./text');

var txt = _interopRequireWildcard(_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var image = exports.image = img;
var text = exports.text = txt;

},{"./image":7,"./text":9}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.atPos = atPos;
exports.lowerRight = lowerRight;
exports.lowerLeft = lowerLeft;
exports.upperRight = upperRight;
exports.upperLeft = upperLeft;
exports.center = center;
/**
 * Return a function for positioning a watermark on a target canvas
 *
 * @param {Function} xFn - a function to determine an x value
 * @param {Function} yFn - a function to determine a y value
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha
 * @return {Function}
 */
function atPos(xFn, yFn, text, font, fillStyle, alpha) {
  alpha || (alpha = 1.0);
  return function (target) {
    var context = target.getContext('2d');
    context.save();

    context.globalAlpha = alpha;
    context.fillStyle = fillStyle;
    context.font = font;
    var metrics = context.measureText(text);
    context.fillText(text, xFn(target, metrics, context), yFn(target, metrics, context));

    context.restore();
    return target;
  };
}

/**
 * Write text to the lower right corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
function lowerRight(text, font, fillStyle, alpha, y) {
  return atPos(function (target, metrics) {
    return target.width - (metrics.width + 10);
  }, function (target) {
    return y || target.height - 10;
  }, text, font, fillStyle, alpha);
}

/**
 * Write text to the lower left corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
function lowerLeft(text, font, fillStyle, alpha, y) {
  return atPos(function () {
    return 10;
  }, function (target) {
    return y || target.height - 10;
  }, text, font, fillStyle, alpha);
}

/**
 * Write text to the upper right corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
function upperRight(text, font, fillStyle, alpha, y) {
  return atPos(function (target, metrics) {
    return target.width - (metrics.width + 10);
  }, function () {
    return y || 20;
  }, text, font, fillStyle, alpha);
}

/**
 * Write text to the upper left corner of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
function upperLeft(text, font, fillStyle, alpha, y) {
  return atPos(function () {
    return 10;
  }, function () {
    return y || 20;
  }, text, font, fillStyle, alpha);
}

/**
 * Write text to the center of the target canvas
 *
 * @param {String} text - the text to write
 * @param {String} font - same as the CSS font property
 * @param {String} fillStyle
 * @param {Number} alpha - control text transparency
 * @param {Number} y - height in text metrics is not very well supported. This is a manual value
 * @return {Function}
 */
function center(text, font, fillStyle, alpha, y) {
  return atPos(function (target, metrics, ctx) {
    ctx.textAlign = 'center';return target.width / 2;
  }, function (target, metrics, ctx) {
    ctx.textBaseline = 'middle';return target.height / 2;
  }, text, font, fillStyle, alpha);
}

},{}],10:[function(_dereq_,module,exports){
// required to safely use babel/register within a browserify codebase

"use strict";

exports.__esModule = true;

exports["default"] = function () {};

module.exports = exports["default"];
},{}]},{},[1])(1)
});