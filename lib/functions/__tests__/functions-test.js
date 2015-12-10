import {invoker, sequence, identity} from '../';

describe('functions', function () {
  it('can create an invoker function', function () {
    const sum = (x, y) => x + y;
    const fn = invoker(sum);
    const result = fn([1, 2]);
    expect(result).toBe(3);
  });

  it('can create a sequence of functions', function () {
    const fn = sequence(
      (x) => x + 4,
      (z) => z + 2
    );
    const value = fn(3);
    expect(value).toBe(9);
  });

  it('can return a given argument', function () {
    const value = identity(4);
    expect(value).toBe(4);
  });
});
