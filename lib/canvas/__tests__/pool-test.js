import { CanvasPool } from '../pool';

/**
 * Mock the clearRect method of a canvas
 *
 * @param {HTMLCanvasElement} canvas
 * @return {HTMLCanvasElement}
 */
const releasable = canvas => {
  const context = {
    clearRect: jest.fn()
  };
  canvas.getContext = twoD => {
    canvas.context = context;
    return context;
  }
  return canvas;
};

/**
 * Fill the pool with the given number of canvas elements
 *
 * @param {CanvasPool} pool
 * @param {Number} length
 */
function fill(pool, length) {
  let i = 0;
  const canvases = [];
  while (i < length) {
    canvases.push(releasable(pool.pop()));
    i++;
  }

  canvases.forEach(pool.release);
}

describe('CanvasPool', () => {
  let pool;

  beforeEach(() => {
    pool = CanvasPool();
  });

  describe('pop()', () => {
    it('should return a canvas', () => {
      const canvas = pool.pop()
      expect(canvas).toBeTruthy();
    });

    it('should reuse a canvas if available', () => {
      const canvas = pool.pop();

      // free up canvas
      pool.release(releasable(canvas));

      const other = pool.pop();

      expect(other).toBe(canvas);
    });
  });

  describe('.length', () => {
    it('should return the number of available canvas elements', () => {
      fill(pool, 5);
      expect(pool.length).toBe(5);
    });
  });

  describe('release()', () => {
    it('should wipe the canvas to make it ready for other draws', () => {
      const canvas = pool.pop()
      releasable(canvas).width = 50;
      canvas.height = 60;
      pool.release(canvas);
      expect(canvas.context.clearRect).toBeCalledWith(0, 0, 50, 60);
    });

    it('should increase the length of available canvas elements', () => {
      const canvas = pool.pop();
      pool.release(releasable(canvas));
      expect(pool.length).toBe(1);
    });
  });

  describe('clear()', () => {
    it('should wipe any canvas references', () => {
      fill(pool, 5);
      pool.clear();
      expect(pool.length).toBe(0);
    });
  });
});
