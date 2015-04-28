jest.dontMock('../');
import {invoker} from '../';

describe('functions', function () {
  it('can create an invoker function', function () {
    let sum = (x, y) => x + y;
    let fn = invoker(sum);
    let result = fn([1, 2]);
    expect(result).toBe(3);
  });
});
