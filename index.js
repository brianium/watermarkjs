require('babelify/polyfill');

import {load, map} from './lib/image';
import {invoker} from './lib/functions';

function lowerRight(target, watermark) {
  let context = target.getContext('2d');
  context.drawImage(watermark, target.width - watermark.width, target.height - watermark.height);
  return target;
}

load(['http://images.clipartpanda.com/earth-clipart-yckMB7XcE.png', 'http://www.fresnostate.edu/csm/ees/images/earth.jpg'])
  .then(map)
  .then(invoker(lowerRight))
  .then(function(c) {
    document.body.appendChild(c);
  });
