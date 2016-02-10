'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var DIST = 'dist';
var path = require('path');
var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

var imageOptimizeTask = function(src, dest) {
  return gulp.src(src)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(dest))
    .pipe($.size({title: 'images'}));
};

// Optimize Images
gulp.task('images', function() {
  return imageOptimizeTask('app/images/**/*', dist('images'));
});