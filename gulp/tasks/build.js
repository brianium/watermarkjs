'use strict';
var gulp = require('gulp');

gulp.task('build', ['browserify', 'clean'], function() {
});

gulp.task('default', ['build']);
