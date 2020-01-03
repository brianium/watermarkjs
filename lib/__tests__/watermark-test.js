import watermark from '../';

const blob = require('../blob');
blob.blob = jest.fn();

const canvas = require('../canvas');
canvas.dataUrl = jest.fn();

const image = require('../image');
image.load = jest.fn();
image.mapToCanvas = jest.fn();
image.imageToCanvas = jest.fn();
image.createImage = jest.fn();

const style = require('../style');
style.result = jest.fn();

describe('watermark', function () {

  let promise = {
    then(fn) {
      fn();
      return this;
    }
  };

  beforeEach(function () {
    image.load.mockReturnValueOnce(promise);
  });

  it('can load urls and files', function () {
    const urls = ['url1', new File()];
    const init = () => console.log(initialized);

    watermark(urls, {
      init
    });

    expect(image.load).toBeCalledWith(urls, init);
  });

  describe('.dataUrl()', function () {
    it('returns a new object structure', function () {
      const draw = jest.fn();
      const first = watermark(['url1', 'url2'], {}, promise);
      first.then = () => first;
      const second = first.dataUrl(draw);

      expect(first).not.toBe(second);
    });
  });

  describe('.blob()', function () {
    it('should delegate to the dataUrl function and map to a blob', function () {
      const mark = watermark(['url1', 'url1'], {}, promise);
      mark.dataUrl = jest.fn();
      mark.dataUrl.mockReturnValueOnce(promise);
      const draw = jest.fn();

      const newMark = mark.blob(draw);

      expect(mark.dataUrl).toBeCalledWith(draw);
      expect(blob.blob).toBeCalled();
      expect(newMark).not.toBe(mark);
    });
  });

  describe('.image()', function () {
    it('should delegate to the dataUrl function and map to an image', function () {
      const mark = watermark(['url1', 'url1'], {}, promise);
      mark.dataUrl = jest.fn();
      mark.dataUrl.mockReturnValueOnce(promise);
      const draw = jest.fn();

      const newMark = mark.image(draw);

      expect(mark.dataUrl).toBeCalledWith(draw);
      expect(image.createImage).toBeCalled();
      expect(newMark).not.toBe(mark);
    });
  });
});
