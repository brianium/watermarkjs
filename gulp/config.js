'use strict';

var lib = 'lib';

module.exports = {
  lib: lib,
  main: 'index.js',
  dist: 'dist',
  watch: {
    paths: ['js'].reduce(function(paths, ext) {
      return paths.concat([lib + '/**/*.' + ext, lib + '/*.' + ext]);
    }, [])
  }
};
