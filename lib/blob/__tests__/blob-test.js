import {split, decode, uint8} from '../';

const testUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAgAElEQ…z4wYdQblhRRGYSxWfKk909djpT+VOeAue/QVI/7VHKn/3/ANXZ6cTaQP0eAAAAAElFTkSuQmCC';

describe('blobs', function () {
  it('can break a data url into parts', function () {
    const parts = split(testUrl);
    expect(parts[0]).toEqual('image/png');
    expect(parts[1][0]).toEqual('i');
  });

  it('can decode base64 content', function () {
    const parts = split(testUrl);
    const decoded = decode(parts[1]);
    expect(decoded).toEqual(atob(parts[1]));
  });

  it('can convert raw data to a Uint8Array', function () {
    const decoded = decode('hello');
    const ints = uint8(decoded);
    expect(ints[0]).toEqual(decoded.charCodeAt(0));
  });
});
