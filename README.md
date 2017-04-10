# watermark.js [![Build Status](https://travis-ci.org/brianium/watermarkjs.svg?branch=master)](https://travis-ci.org/brianium/watermarkjs)

A functional library for watermarking images in the browser. Written with ES6, and made available
to current browsers via [Babel](https://babeljs.io/). Supports urls, file inputs, blobs, and on-page images.

**Note:**
For anyone that is interested: I ported this to a ClojureScript library called
[Dandy Roll](https://github.com/brianium/dandy-roll).

## Tested Browsers

Any browser supporting [File](https://developer.mozilla.org/en-US/docs/Web/API/File#Browser_compatibility) and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader#Browser_compatibility) should work. The following browsers have been
tested and work:

* IE10 (Windows 7)
* Chrome 42 (OS X 10.10.3)
* Firefox 38 (OS X 10.10.3)
* Safari 8.0.6 (OS X 10.10.3)
* Opera 29.0 (OS X 10.10.3)

Please feel free to update this list or submit a fix for a particular browser via a pull request.

## Installing

watermark.js is available via npm and bower:

```
# install via npm
$ npm install watermarkjs

# install via bower
$ bower install watermarkjs
```

## Usage

```js
// watermark by local path
watermark(['img/photo.jpg', 'img/logo.png'])
  .image(watermark.image.lowerRight(0.5))
  .then(img => document.getElementById('container').appendChild(img));

// load a url and file object
const upload = document.querySelector('input[type=file]').files[0];
watermark([upload, 'img/logo.png'])
  .image(watermark.image.lowerLeft(0.5))
  .then(img => document.getElementById('container').appendChild(img));

// watermark from remote source
const options = {
  init(img) {
    img.crossOrigin = 'anonymous'
  }
};
watermark(['http://host.com/photo.jpg', 'http://host.com/logo.png'], options)
  .image(watermark.image.lowerRight(0.5))
  .then(img => document.getElementById('container').appendChild(img));
```

## Building

Before building or testing, install all the deps:

```
npm i
```

There is an npm script you can run to build:

```
npm run build
```

Or to kick off the file watcher and build as you make changes, run the start task:

```
$ npm start
```

## Testing

There is an npm script for that too!:

```
$ npm test
```

This library uses the [Jest](https://facebook.github.io/jest/) testing framework. Due to some current
issues with Jest, Node 0.10.x is required to run the tests.

## Examples

You can view examples and documentation by running the `sync` task via npm:

```
$ npm run sync
```
The examples demonstrate using watermark images and text, as well as a demonstration
of uploading a watermarked image to Amazon S3. It is the same content hosted at
[http://brianium.github.io/watermarkjs/](http://brianium.github.io/watermarkjs/).

## Development

Running `npm run dev` will start a browser and start watching source files for changes.

## Motivation

* Not every server has image libraries (shared hosting anyone?)
* Not every server has reliable concurrency libs for efficient uploading (shared hosting anyone?)
* JavaScript is fun and cool - more so with ES6

Clearly watermarking on the client has some limitations when watermarking urls and on-page elements. The curious can find urls for non-watermarked images, but it is likely that most average users won't go down this path - keeping this soft barrier useful. However!...

watermark.js has the ability to accept file inputs as a source for watermarking. This makes it easy to preview, watermark, and upload without the non-watermarked image ever becoming public. Check out the [uploading](http://brianium.github.io/watermarkjs/uploading.html) demo to see this in action.

This tool certainly shines in admin or CMS environments where you want to generate watermarks and upload them asynchronously where it would not be possible or preferable on the server. One less thing the server has to do can be a good thing :)

## Suggestions? Improvements?

Please open issues or pull requests if you have bugs/improvements.
