import {createImage, getLoader} from '../';

describe('image', function () {
  it('can create a new image', function () {
    const onload = () => console.log('loaded');
    const img = createImage('url1', onload);
    expect(img.src).toBe('url1');
    expect(img.onload).toBe(onload);
  });

  it('returns an identity loader function when given an image', function () {
    const img = new Image();
    const loader = getLoader(img);
    expect(loader(img)).toBe(img);
  });
});
