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

gulp.task('browserify', function() {
  return browserify('./' + config.main)
      .transform(babelify)
      .bundle()
      .pipe(source(config.main))
      .pipe(buffer())
      .pipe(rename(stripDirectory))
      .pipe(gulp.dest(config.dist))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(config.dist));
});
