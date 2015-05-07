'use strict';

var lib = 'lib';

module.exports = {
  lib: lib,
  main: 'index.js',
  dist: 'dist',
  examples: 'examples',
  watch: {
    paths: ['js'].reduce(function(paths, ext) {
      return paths.concat([lib + '/**/*.' + ext, lib + '/*.' + ext, 'index.js']);
    }, [])
  },
  browserSync: {
    server: {
      baseDir: 'examples',
      directory: true
    },
    startPath: '/index.html',
    port: 8000
  }
};
