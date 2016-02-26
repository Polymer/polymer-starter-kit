'use strict';

var gulp = require('gulp');
var del = require('del');
var DIST = 'dist';
var path = require('path');
var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', dist()]);
});
