jest.dontMock('../index');
import {watermark} from '../index';
import {load} from '../lib/image';

describe('watermark', function () {

  let promise = {
    then(fn) {
      return this;
    }
  };

  describe('.blob()', function () {
    it('returns a new object structure', function () {
      let first = watermark(promise);
      let second = first.blob((one, two) => one.drawImage(two));
      expect(first).not.toBe(second);
    });
  });
});
