import {createImage, getLoader} from '../';

const baseURL = 'http://localhost:3000/';

describe('image', function () {
  it('can create a new image', function () {
    const img = createImage(`${baseURL}url1`, onload);
    expect(img.src).toBe(`${baseURL}url1`);
    expect(img.onload).toBe(onload);
  });

  it('returns an identity loader function when given an image', function () {
    const img = new Image();
    const loader = getLoader(img);
    expect(loader(img)).toBe(img);
  });
});
