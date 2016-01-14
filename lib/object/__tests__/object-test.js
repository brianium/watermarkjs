import {extend, clone} from '../';

describe('object', function(){
  describe('extend()', function() {
    it('can extend first object with second object', function(){
      let first  = {foo: 'bar', baz: 'hash'},
      second = {baz: 'dash', joe: 'bob'};

      let merged = extend(first, second);
      expect(merged).toEqual({foo: 'bar', baz: 'dash', joe: 'bob'});
    });
  });

  describe('clone()', function() {
    it('should create a shallow copy of an object', () => {
      const obj = {'name': 'Brian'};

      const copy = clone(obj);

      expect(obj).not.toBe(copy);
      expect(obj).toEqual(copy);
    });
  });
});
