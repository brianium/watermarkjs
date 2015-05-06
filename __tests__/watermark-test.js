jest.dontMock('../index');
jest.dontMock('../lib/functions')
import {watermark} from '../index';
import {dataUrl} from '../lib/canvas';
import {blob} from '../lib/blob';
import {load, fromFiles, mapToCanvas, createImage} from '../lib/image';

describe('watermark', function () {

  let promise = {
    then(fn) {
      fn();
      return this;
    }
  };

  beforeEach(function () {

  });

  describe('.dataUrl()', function () {
    it('returns a new object structure', function () {
      let first = watermark(promise);

      let draw = jest.genMockFunction();
      draw.mockReturnValueOnce(promise);

      let second = first.dataUrl(draw);

      expect(first).not.toBe(second);
      expect(draw).toBeCalled();
      expect(dataUrl).toBeCalled();
    });
  });

  describe('.blob()', function () {
    it('should delegate to the dataUrl function and map to a blob', function () {
      let mark = watermark(promise);
      mark.dataUrl = jest.genMockFunction();
      mark.dataUrl.mockReturnValueOnce(promise);
      let draw = jest.genMockFunction();

      let newMark = mark.blob(draw);

      expect(mark.dataUrl).toBeCalledWith(draw);
      expect(blob).toBeCalled();
      expect(newMark).not.toBe(mark);
    });
  });

  describe('.image()', function () {
    it('should delegate to the dataUrl function and map to an image', function () {
      let mark = watermark(promise);
      mark.dataUrl = jest.genMockFunction();
      mark.dataUrl.mockReturnValueOnce(promise);
      let draw = jest.genMockFunction();

      let newMark = mark.image(draw);

      expect(mark.dataUrl).toBeCalledWith(draw);
      expect(createImage).toBeCalled();
      expect(newMark).not.toBe(mark);
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
