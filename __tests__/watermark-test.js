jest.dontMock('../index');
import {watermark} from '../index';
import {load, fromFiles} from '../lib/image';

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

  describe('.urls()', function () {
    it('calls load and returns a new object structure', function () {
      let first = watermark(promise);
      let urls = ['url1', 'url2'];
      let second = first.urls(urls);

      expect(first).not.toBe(second);
      expect(load).toBeCalledWith(urls, undefined);
    });
  });

  describe('.files()', function () {
    it('calls fromFiles and returns a new object structure', function () {
      let first = watermark(promise);
      let fileObjects = [{}, {}];
      let second = first.files(fileObjects);

      expect(first).not.toBe(second);
      expect(fromFiles).toBeCalledWith(fileObjects);
    });
  });
});
