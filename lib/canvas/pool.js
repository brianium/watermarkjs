/**
 * An immutable canvas pool allowing more efficient use of canvas resources
 *
 * @typedef {Object} CanvasPool
 * @property {Function} pop - return a promise that will evaluate to a canvas
 * @property {Number} length - the number of available canvas elements
 * @property {HTMLCanvasElement[]} elements - the canvas elements used by the pool
 * @property {Function} clear - empty the pool of canvas elements
 * @property {Function} release - free a pool up for release and return the data url
 */

/**
 * Create a CanvasPool with the given size
 *
 * @param {Number} size
 * @param {HTMLCanvasElement[]} elements
 * @param {EventEmitter} eventEmitter
 * @return {CanvasPool}
 */
export function CanvasPool() {
  const canvases = [];

  return {
    /**
     * Get the next available canvas from the pool
     *
     * @return {HTMLCanvasElement}
     */
    pop() {
      if (this.length === 0) {
        canvases.push(document.createElement('canvas'));
      }

      return canvases.pop();
    },

    /**
     * Return the number of available canvas elements in the pool
     *
     * @return {Number}
     */
    get length() {
      return canvases.length;
    },

    /**
     * Return a canvas to the pool. This function will clear the canvas for reuse
     *
     * @param {HTMLCanvasElement} canvas
     * @return {String}
     */
    release(canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvases.push(canvas);
    },

    /**
     * Empty the pool, destroying any references to canvas objects
     */
    clear() {
      canvases.splice(0, canvases.length);
    },

    /**
     * Return the collection of canvases in the pool
     *
     * @return {HTMLCanvasElement[]}
     */
    get elements() {
      return canvases;
    }
  }
}

const shared = CanvasPool();
export default shared;
