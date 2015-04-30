require('babelify/polyfill');

import {load, mapToCanvas} from './lib/image';
import {invoker} from './lib/functions';
import {dataUrl} from './lib/canvas';
import {blob} from './lib/blob';
import {lowerRight} from './lib/position';


let urls = [
  'http://www.html5rocks.com/static/images/profiles/monsurhossain.png',
  'http://www.html5rocks.com/static/images/profiles/mattgaunt.png'
];

load(urls, img => img.crossOrigin = 'anonymous')
  .then(mapToCanvas)
  .then(invoker(lowerRight))
  .then(dataUrl)
  .then(blob)
  .then(blob => console.log(blob));
