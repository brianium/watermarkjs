jest.dontMock('../');
jest.dontMock('babelify/polyfill');
require('babelify/polyfill');
import {invoker, sequence, identity} from '../';

describe('functions', function () {
  it('can create an invoker function', function () {
    let sum = (x, y) => x + y;
    let fn = invoker(sum);
    let result = fn([1, 2]);
    expect(result).toBe(3);
  });

  it('can create a sequence of functions', function () {
    let fn = sequence(
      (x) => x + 4,
      (z) => z + 2
    );
    let value = fn(3);
    expect(value).toBe(9);
  });

  it('can return a given argument', function () {
    let value = identity(4);
    expect(value).toBe(4);
  });
});
