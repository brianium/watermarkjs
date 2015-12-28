import {sequence, identity} from '../';

describe('functions', function () {
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
