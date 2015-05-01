jest.dontMock('../index');
import {watermark} from '../index';
import {load} from '../lib/image';

describe('watermark', function () {

  let promise = {
    then(fn) {
      return this;
    }
  };

  beforeEach(function () {
    load.mockReturnValueOnce(promise);
  });

  describe('.asBlob()', function () {
    it('returns a new object structure', function () {
      let first = watermark(['url1', 'url2']);
      let second = first.asBlob((one, two) => one.drawImage(two));
      expect(first).not.toBe(second);
    });
  });
});
