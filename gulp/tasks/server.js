'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config');

gulp.task('server', ['watch'], function () {
  browserSync(config.browserSync);
});

gulp.task('reload', ['build'], function () {
  browserSync.reload();
});
