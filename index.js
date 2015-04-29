require('babelify/polyfill');

import {load, map} from './lib/image';
import {invoker} from './lib/functions';
import {dataUrl} from './lib/canvas';
import {blob} from './lib/blob';

function lowerRight(target, watermark) {
  let context = target.getContext('2d');
  context.drawImage(watermark, target.width - 50, target.height - 50);
  return target;
}

let urls = [
  'http://www.html5rocks.com/static/images/profiles/monsurhossain.png',
  'http://www.html5rocks.com/static/images/profiles/mattgaunt.png'
];

load(urls, img => img.crossOrigin = 'anonymous')
  .then(map)
  .then(invoker(lowerRight))
  .then(dataUrl)
  .then(blob)
  .then(blob => console.log(blob));
