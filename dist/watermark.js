(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["watermark"] = factory();
	else
		root["watermark"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2).default;


/***/ },
/* 1 */
/***/ function(module, exports) {

	// required to safely use babel/register within a browserify codebase

	"use strict";

	exports.__esModule = true;

	exports["default"] = function () {};

	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = watermark;

	var _image = __webpack_require__(3);

	var _canvas = __webpack_require__(5);

	var _blob = __webpack_require__(6);

	var _style = __webpack_require__(7);

	var style = _interopRequireWildcard(_style);

	var _object = __webpack_require__(10);

	var _pool = __webpack_require__(11);

	var _pool2 = _interopRequireDefault(_pool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * A configuration type for the watermark function
	 *
	 * @typedef {Object} Options
	 * @property {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
	 * @property {Number} poolSize - number of canvas elements available for drawing,
	 * @property {CanvasPool} pool - the pool used. If provided, poolSize will be ignored
	 */

	/**
	 * @constant
	 * @type {Options}
	 */
	var defaults = {
	  init: function init() {}
	};

	/**
	 * Merge the given options with the defaults
	 *
	 * @param {Options} options
	 * @return {Options}
	 */
	function mergeOptions(options) {
	  return (0, _object.extend)((0, _object.clone)(defaults), options);
	}

	/**
	 * Release canvases from a draw result for reuse. Returns
	 * the dataURL from the result's canvas
	 *
	 * @param {DrawResult} result
	 * @param {CanvasPool} pool
	 * @return  {String}
	 */
	function release(result, pool) {
	  var canvas = result.canvas;
	  var sources = result.sources;

	  var dataURL = (0, _canvas.dataUrl)(canvas);
	  sources.forEach(pool.release);
	  return dataURL;
	}

	/**
	 * Return a watermark object
	 *
	 *
	 * @param {Array} resources - a collection of urls, File objects, or Image objects
	 * @param {Options} options - a configuration object for watermark
	 * @param {Promise} promise - optional
	 * @return {Object}
	 */
	function watermark(resources) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var promise = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	  var opts = mergeOptions(options);
	  promise || (promise = (0, _image.load)(resources, opts.init));

	  return {
	    /**
	     * Convert the watermarked image into a dataUrl. The draw
	     * function is given all images as canvas elements in order
	     *
	     * @param {Function} draw
	     * @return {Object}
	     */

	    dataUrl: function dataUrl(draw) {
	      var promise = this.then(function (images) {
	        return (0, _image.mapToCanvas)(images, _pool2.default);
	      }).then(function (canvases) {
	        return style.result(draw, canvases);
	      }).then(function (result) {
	        return release(result, _pool2.default);
	      });

	      return watermark(resources, opts, promise);
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

	      return watermark(resources, opts, promise);
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

	      return watermark(resources, opts, promise);
	    },

	    /**
	     * Convert the watermark into a blob
	     *
	     * @param {Function} draw
	     * @return {Object}
	     */
	    blob: function blob(draw) {
	      var promise = this.dataUrl(draw).then(_blob.blob);

	      return watermark(resources, opts, promise);
	    },

	    /**
	     * Convert the watermark into an image using the given draw function
	     *
	     * @param {Function} draw
	     * @return {Object}
	     */
	    image: function image(draw) {
	      var promise = this.dataUrl(draw).then(_image.createImage);

	      return watermark(resources, opts, promise);
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

	/**
	 * Clean up all canvas references
	 */
	watermark.destroy = function () {
	  return _pool2.default.clear();
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

	var _functions = __webpack_require__(4);

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
	 * Draw an image to a canvas element
	 *
	 * @param {Image} img
	 * @param {HTMLCanvasElement} canvas
	 * @return {HTMLCanvasElement}
	 */
	function drawImage(img, canvas) {
	  var ctx = canvas.getContext('2d');

	  canvas.width = img.width;
	  canvas.height = img.height;
	  ctx.drawImage(img, 0, 0);
	  return canvas;
	}

	/**
	 * Convert an Image object to a canvas
	 *
	 * @param {Image} img
	 * @param {CanvasPool} pool
	 * @return {HTMLCanvasElement}
	 */
	function imageToCanvas(img, pool) {
	  var canvas = pool.pop();
	  return drawImage(img, canvas);
	}

	/**
	 * Convert an array of image objects
	 * to canvas elements
	 *
	 * @param {Array} images
	 * @param {CanvasPool} pool
	 * @return {HTMLCanvasElement[]}
	 */
	function mapToCanvas(images, pool) {
	  return images.map(function (img) {
	    return imageToCanvas(img, pool);
	  });
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sequence = sequence;
	exports.identity = identity;
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

/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.blob = undefined;
	exports.split = split;
	exports.decode = decode;
	exports.uint8 = uint8;

	var _functions = __webpack_require__(4);

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.text = exports.image = undefined;
	exports.result = result;

	var _image = __webpack_require__(8);

	var img = _interopRequireWildcard(_image);

	var _text = __webpack_require__(9);

	var txt = _interopRequireWildcard(_text);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * @typedef {Object} DrawResult
	 * @property {HTMLCanvasElement} canvas - the end result of a draw
	 * @property {HTMLCanvasElement[]} sources - the sources used in the draw
	 */

	var image = exports.image = img;
	var text = exports.text = txt;

	/**
	 * Create a DrawResult by apply a list of canvas elements to a draw function
	 *
	 * @param {Function} draw - the draw function used to create a DrawResult
	 * @param {HTMLCanvasElement} sources - the canvases used by the draw function
	 * @return {DrawResult}
	 */
	function result(draw, sources) {
	  var canvas = draw.apply(null, sources);
	  return {
	    canvas: canvas,
	    sources: sources
	  };
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

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

/***/ },
/* 9 */
/***/ function(module, exports) {

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

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.extend = extend;
	exports.clone = clone;
	/**
	 * Extend one object with the properties of another
	 *
	 * @param {Object} first
	 * @param {Object} second
	 * @return {Object}
	 */
	function extend(first, second) {
	  var secondKeys = Object.keys(second);
	  secondKeys.forEach(function (key) {
	    return first[key] = second[key];
	  });
	  return first;
	}

	/**
	 * Create a shallow copy of the object
	 *
	 * @param {Object} obj
	 * @return {Object}
	 */
	function clone(obj) {
	  return extend({}, obj);
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CanvasPool = CanvasPool;
	/**
	 * An immutable canvas pool allowing more efficient use of canvas resources
	 *
	 * @typedef {Object} CanvasPool
	 * @property {Function} pop - return a promise that will evaluate to a canvas
	 * @property {Number} length - the number of available canvas elements
	 * @property {HTMLCanvasElement[]} elements - the canvas elements used by the pool
	 * @property {Function} clear - empty the pool of canvas elements
	 * @property {Function} release - free a pool up for release and return the data url
	 */

	/**
	 * Create a CanvasPool with the given size
	 *
	 * @param {Number} size
	 * @param {HTMLCanvasElement[]} elements
	 * @param {EventEmitter} eventEmitter
	 * @return {CanvasPool}
	 */
	function CanvasPool() {
	  var canvases = [];

	  return {
	    /**
	     * Get the next available canvas from the pool
	     *
	     * @return {HTMLCanvasElement}
	     */

	    pop: function pop() {
	      if (this.length === 0) {
	        canvases.push(document.createElement('canvas'));
	      }

	      return canvases.pop();
	    },

	    /**
	     * Return the number of available canvas elements in the pool
	     *
	     * @return {Number}
	     */
	    get length() {
	      return canvases.length;
	    },

	    /**
	     * Return a canvas to the pool. This function will clear the canvas for reuse
	     *
	     * @param {HTMLCanvasElement} canvas
	     * @return {String}
	     */
	    release: function release(canvas) {
	      var context = canvas.getContext('2d');
	      context.clearRect(0, 0, canvas.width, canvas.height);
	      canvases.push(canvas);
	    },

	    /**
	     * Empty the pool, destroying any references to canvas objects
	     */
	    clear: function clear() {
	      canvases.splice(0, canvases.length);
	    },

	    /**
	     * Return the collection of canvases in the pool
	     *
	     * @return {HTMLCanvasElement[]}
	     */
	    get elements() {
	      return canvases;
	    }
	  };
	}

	var shared = CanvasPool();
	exports.default = shared;

/***/ }
/******/ ])
});
;