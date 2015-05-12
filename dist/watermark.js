(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

/**
 * Return a watermark object
 *
 * @param {Array} resources - a collection of urls, File objects, or Image objects
 * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
 * @param {Promise} promise - optional
 * @return {Object}
 */
exports.watermark = watermark;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _libImage = require("./lib/image");

var load = _libImage.load;
var mapToCanvas = _libImage.mapToCanvas;
var createImage = _libImage.createImage;

var invoker = require("./lib/functions").invoker;

var mapToDataUrl = require("./lib/canvas").dataUrl;

var mapToBlob = require("./lib/blob").blob;

var style = _interopRequireWildcard(require("./lib/style"));

function watermark(resources, init, promise) {

  promise || (promise = load(resources, init));

  return {

    /**
     * Convert the watermarked image into a dataUrl. The draw
     * function is given all images as canvas elements in order
     *
     * @param {Function} draw
     * @return {Object}
     */
    dataUrl: function dataUrl(draw) {
      var promise = this.then(mapToCanvas).then(invoker(draw)).then(mapToDataUrl);

      return watermark(resources, init, promise);
    },

    /**
     * Load additional resources
     *
     * @param {Array} resources - a collection of urls, File objects, or Image objects
     * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
     * @return {Object}
     */
    load: (function (_load) {
      var _loadWrapper = function load(_x, _x2) {
        return _load.apply(this, arguments);
      };

      _loadWrapper.toString = function () {
        return _load.toString();
      };

      return _loadWrapper;
    })(function (resources, init) {
      var promise = this.then(function (resource) {
        return load([resource].concat(resources), init);
      });

      return watermark(resources, init, promise);
    }),

    /**
     * Render the current state of the watermarked image. Useful for performing
     * actions after the watermark has been applied
     *
     * @return {Object}
     */
    render: function render() {
      var promise = this.then(function (resource) {
        return load([resource]);
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
      var promise = this.dataUrl(draw).then(mapToBlob);

      return watermark(resources, init, promise);
    },

    /**
     * Convert the watermark into an image using the given draw function
     *
     * @param {Function} draw
     * @return {Object}
     */
    image: function image(draw) {
      var promise = this.dataUrl(draw).then(createImage);

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
}

;

/**
 * Style functions
 */
watermark.image = style.image;
watermark.text = style.text;

/**
 * Export to browser
 */
window.watermark = watermark;

},{"./lib/blob":2,"./lib/canvas":3,"./lib/functions":4,"./lib/image":5,"./lib/style":7}],2:[function(require,module,exports){


/**
 * Split a data url into a content type and raw data
 *
 * @param {String} dataUrl
 * @return {Array}
 */
"use strict";

exports.split = split;

/**
 * Decode a base64 string
 *
 * @param {String} base64
 * @return {String}
 */
exports.decode = decode;

/**
 * Return a string of raw data as a Uint8Array
 *
 * @param {String} data
 * @return {UInt8Array}
 */
exports.uint8 = uint8;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var sequence = require("../functions").sequence;

var url = /^data:([^;]+);base64,(.*)$/;
function split(dataUrl) {
  return url.exec(dataUrl).slice(1);
}

function decode(base64) {
  return window.atob(base64);
}

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
var blob = sequence(split, function (parts) {
  return [decode(parts[1]), parts[0]];
}, function (blob) {
  return new Blob([uint8(blob[0])], { type: blob[1] });
});
exports.blob = blob;

},{"../functions":4}],3:[function(require,module,exports){
/**
 * Get the data url of a canvas
 *
 * @param {HTMLCanvasElement}
 * @return {String}
 */
"use strict";

exports.dataUrl = dataUrl;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function dataUrl(canvas) {
  return canvas.toDataURL();
}

},{}],4:[function(require,module,exports){
/**
 * Returns a function that invokes the given function
 * with an array of arguments
 *
 * @param {Function} fn
 * @return {Function}
 */
"use strict";

exports.invoker = invoker;

/**
 * Return a function that executes a sequence of functions from left to right,
 * passing the result of a previous operation to the next
 *
 * @param {...funcs}
 * @return {Function}
 */
exports.sequence = sequence;

/**
 * Return the argument passed to it
 *
 * @param {Mixed} x
 * @return {Mixed}
 */
exports.identity = identity;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function invoker(fn) {
  return function (args) {
    return fn.apply(null, args);
  };
}

function sequence() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function (value) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = funcs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var fn = _step.value;

        value = fn.call(null, value);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return value;
  };
}

function identity(x) {
  return x;
}

},{}],5:[function(require,module,exports){


/**
 * Given a resource, return an appropriate loading function for it's type
 *
 * @param {String|File|Image} resource
 * @return {Function}
 */
"use strict";

exports.getLoader = getLoader;

/**
 * Used for loading image resources asynchronously and maintaining
 * the supplied order of arguments
 *
 * @param {Array} resources - a mixed array of urls, File objects, or Image objects
 * @param {Function} init - called at the beginning of resource initialization
 * @return {Promise}
 */
exports.load = load;

/**
 * Load an image by its url
 *
 * @param {String} url
 * @param {Function} init - an optional image initializer
 * @return {Promise}
 */
exports.loadUrl = loadUrl;

/**
 * Return a collection of images from an
 * array of File objects
 *
 * @param {File} file
 * @return {Promise}
 */
exports.loadFile = loadFile;

/**
 * Create a new image, optionally configuring it's onload behavior
 *
 * @param {String} url
 * @param {Function} onload
 * @return {Image}
 */
exports.createImage = createImage;

/**
 * Convert an Image object to a canvas
 *
 * @param {Image} img
 * @return {HTMLCanvasElement}
 */
exports.imageToCanvas = imageToCanvas;

/**
 * Convert an array of image objects
 * to canvas elements
 *
 * @param {Array} images
 * @return {Array}
 */
exports.mapToCanvas = mapToCanvas;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var identity = require("../functions").identity;

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
function getLoader(resource) {
  var type = typeof resource;

  if (type === "string") {
    return loadUrl;
  }

  if (resource instanceof Image) {
    return identity;
  }

  return loadFile;
}

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

function loadUrl(url, init) {
  var img = new Image();
  typeof init === "function" && init(img);
  return new Promise(function (resolve) {
    img.onload = function () {
      return resolve(img);
    };
    img.src = url;
  });
}

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

function createImage(url, onload) {
  var img = new Image();
  if (typeof onload === "function") {
    img.onload = onload;
  }
  img.src = url;
  return img;
}

function imageToCanvas(img) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

function mapToCanvas(images) {
  return images.map(imageToCanvas);
}

},{"../functions":4}],6:[function(require,module,exports){
/**
 * Return a function for positioning a watermark on a target canvas
 *
 * @param {Function} xFn - a function to determine an x value
 * @param {Function} yFn - a function to determine a y value
 * @param {Number} alpha
 * @return {Function}
 */
"use strict";

exports.atPos = atPos;

/**
 * Place the watermark in the lower right corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
exports.lowerRight = lowerRight;

/**
 * Place the watermark in the upper right corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
exports.upperRight = upperRight;

/**
 * Place the watermark in the lower left corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
exports.lowerLeft = lowerLeft;

/**
 * Place the watermark in the upper left corner of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
exports.upperLeft = upperLeft;

/**
 * Place the watermark in the center of the target
 * image
 *
 * @param {Number} alpha
 * @return {Function}
 */
exports.center = center;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function atPos(xFn, yFn, alpha) {
  alpha || (alpha = 1);
  return function (target, watermark) {
    var context = target.getContext("2d");
    context.save();

    context.globalAlpha = alpha;
    context.drawImage(watermark, xFn(target, watermark), yFn(target, watermark));

    context.restore();
    return target;
  };
}

function lowerRight(alpha) {
  return atPos(function (target, mark) {
    return target.width - (mark.width + 10);
  }, function (target, mark) {
    return target.height - (mark.height + 10);
  }, alpha);
}

function upperRight(alpha) {
  return atPos(function (target, mark) {
    return target.width - (mark.width + 10);
  }, function (target, mark) {
    return 10;
  }, alpha);
}

function lowerLeft(alpha) {
  return atPos(function (target, mark) {
    return 10;
  }, function (target, mark) {
    return target.height - (mark.height + 10);
  }, alpha);
}

function upperLeft(alpha) {
  return atPos(function (target, mark) {
    return 10;
  }, function (target, mark) {
    return 10;
  }, alpha);
}

function center(alpha) {
  return atPos(function (target, mark) {
    return (target.width - mark.width) / 2;
  }, function (target, mark) {
    return (target.height - mark.height) / 2;
  }, alpha);
}

},{}],7:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var img = _interopRequireWildcard(require("./image"));

var txt = _interopRequireWildcard(require("./text"));

var image = img;
exports.image = image;
var text = txt;
exports.text = text;

},{"./image":6,"./text":8}],8:[function(require,module,exports){
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
"use strict";

exports.atPos = atPos;

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
exports.lowerRight = lowerRight;

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
exports.lowerLeft = lowerLeft;

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
exports.upperRight = upperRight;

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
exports.upperLeft = upperLeft;

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
exports.center = center;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function atPos(xFn, yFn, text, font, fillStyle, alpha) {
  alpha || (alpha = 1);
  return function (target) {
    var context = target.getContext("2d");
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

function lowerRight(text, font, fillStyle, alpha, y) {
  return atPos(function (target, metrics) {
    return target.width - (metrics.width + 10);
  }, function (target) {
    return y || target.height - 10;
  }, text, font, fillStyle, alpha);
}

function lowerLeft(text, font, fillStyle, alpha, y) {
  return atPos(function () {
    return 10;
  }, function (target) {
    return y || target.height - 10;
  }, text, font, fillStyle, alpha);
}

function upperRight(text, font, fillStyle, alpha, y) {
  return atPos(function (target, metrics) {
    return target.width - (metrics.width + 10);
  }, function () {
    return y || 20;
  }, text, font, fillStyle, alpha);
}

function upperLeft(text, font, fillStyle, alpha, y) {
  return atPos(function () {
    return 10;
  }, function () {
    return y || 20;
  }, text, font, fillStyle, alpha);
}

function center(text, font, fillStyle, alpha, y) {
  return atPos(function (target, metrics, ctx) {
    ctx.textAlign = "center";return target.width / 2;
  }, function (target, metrics, ctx) {
    ctx.textBaseline = "middle";return target.height / 2;
  }, text, font, fillStyle, alpha);
}

},{}]},{},[1]);
