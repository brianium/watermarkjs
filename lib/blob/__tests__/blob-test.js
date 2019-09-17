import {split, decode, uint8} from '../';

const testUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

describe('blobs', function () {
  it('can break a data url into parts', function () {
    const parts = split(testUrl);
    expect(parts[0]).toEqual('image/png');
    expect(parts[1][0]).toEqual('i');
  });

  it('can decode base64 content', function () {
    const parts = split(testUrl);
    const decoded = decode(parts[1]);
    console.log('parts', parts)
    expect(decoded).toEqual(atob(parts[1]));
  });

  it('can convert raw data to a Uint8Array', function () {
    const encoded = window.btoa('hello');
    const decoded = decode(encoded);
    const ints = uint8(decoded);
    expect(ints[0]).toEqual(decoded.charCodeAt(0));
  });
});
