'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config');

gulp.task('server', ['build'], function () {
  browserSync(config.browserSync);
  gulp.watch([
    config.examples + '/**/*.html',
    config.examples + '/**/*.css',
    config.examples + '/scripts/upload.js'
  ]).on('change', browserSync.reload);
});
