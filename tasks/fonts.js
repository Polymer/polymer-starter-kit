'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var DIST = 'dist';
var path = require('path');
var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};


// Copy Web Fonts To Dist
gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest(dist('fonts')))
    .pipe($.size({
      title: 'fonts'
    }));
});
