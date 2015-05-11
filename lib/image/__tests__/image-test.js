jest.dontMock('../');
jest.dontMock('../../functions');
import {createImage, getLoader} from '../';

describe('image', function () {
  it('can create a new image', function () {
    let onload = () => console.log('loaded');
    let img = createImage('url1', onload);
    expect(img.src).toBe('url1');
    expect(img.onload).toBe(onload);
  });

  it('returns an identity loader function when given an image', function () {
    let img = new Image();
    let loader = getLoader(img);
    expect(loader(img)).toBe(img);
  });
});
