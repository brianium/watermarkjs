jest.dontMock('../');
import {createImage} from '../';

describe('image', function () {
  it('can create a new image', function () {
    let onload = () => console.log('loaded');
    let img = createImage('url1', onload);
    expect(img.src).toBe('url1');
    expect(img.onload).toBe(onload);
  });
});
