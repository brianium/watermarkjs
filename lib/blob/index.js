import {sequence} from '../functions';

const url = /^data:([^;]+);base64,(.*)$/;

/**
 * Split a data url into a content type and raw data
 *
 * @param {String} dataUrl
 * @return {Array}
 */
export function split(dataUrl) {
  return url
    .exec(dataUrl)
    .slice(1);
}

/**
 * Decode a base64 string
 *
 * @param {String} base64
 * @return {String}
 */
export function decode(base64) {
  return window.atob(base64);
}

/**
 * Return a string of raw data as a Uint8Array
 *
 * @param {String} data
 * @return {UInt8Array}
 */
export function uint8(data) {
  const length = data.length;
  const uints = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
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
export const blob = sequence(
  split,
  parts => [decode(parts[1]), parts[0]],
  blob => new Blob([uint8(blob[0])], {type: blob[1]})
);
