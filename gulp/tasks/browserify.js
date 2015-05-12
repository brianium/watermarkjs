var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    config = require('../config'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

/**
 * Strips the directory from the path.
 *
 * @param {object} path
 */
function stripDirectory(path) {
  path.dirname = '';
}

function bundle(bun, name) {
  return bun
    .pipe(source(name))
    .pipe(buffer())
    .pipe(rename(stripDirectory))
    .pipe(gulp.dest(config.dist))
    .pipe(gulp.dest(config.examples + '/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(config.dist))
    .pipe(gulp.dest(config.examples + '/scripts'));
}

gulp.task('browserify', function() {
  bundle(browserify('./' + config.main)
      .transform(babelify)
      .bundle(), 'watermark.js');

  return bundle(
    browserify('./index-polyfill.js')
      .transform(babelify)
      .bundle(), 'watermark-polyfill.js');

});
