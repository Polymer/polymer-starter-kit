'use strict';

// Scan Your HTML For Assets & Optimize Them
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var DIST = 'dist';
var path = require('path');
var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};
var runSequence = require('run-sequence');

// Build then deploy to GitHub pages gh-pages branch
gulp.task('build-deploy-gh-pages', function(cb) {
  runSequence(
    'default',
    'deploy-gh-pages',
    cb);
});

// Deploy to GitHub pages gh-pages branch
gulp.task('deploy-gh-pages', function() {
  return gulp.src(dist('**/*'))
    // Check if running task from Travis CI, if so run using GH_TOKEN
    // otherwise run using ghPages defaults.
    .pipe($.if(process.env.TRAVIS === 'true', $.ghPages({
      remoteUrl: 'https://$GH_TOKEN@github.com/polymerelements/polymer-starter-kit.git',
      silent: true,
      branch: 'gh-pages'
    }), $.ghPages()));
});
