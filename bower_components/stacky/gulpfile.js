/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 *
 * This code may only be used under the BSD style license found at polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also subject to
 * an additional IP rights grant found at polymer.github.io/PATENTS.txt
 */
'use strict';

var coverage    = require('gulp-coverage');
var coveralls   = require('gulp-coveralls');
var eventStream = require('event-stream');
var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var lazypipe    = require('lazypipe');
var mocha       = require('gulp-mocha');
var notify      = require('gulp-notify');
var path        = require('path');
var plumber     = require('gulp-plumber');
var watch       = require('gulp-watch');

var ROOT      = __dirname;
var LIB_ROOT  = path.join(ROOT, 'lib');
var TEST_ROOT = path.join(ROOT, 'test');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
  var config = {
    glob:       '{lib,test}/**/*.js',
    emitOnGlob: false,
    gaze:       {debounceDelay: 10},
  };
  return watch(config, function(files) {
    files
      .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
      .pipe(jshintFlow())
      .pipe(eventStream.map(testForFile))
      .pipe(mocha({reporter: 'dot'}))
  });
});

gulp.task('test', ['test:style', 'test:unit']);

gulp.task('test:style', function() {
  return gulp.src('{lib,test}/**/*.js').pipe(jshintFlow());
});

gulp.task('test:unit', function() {
  return gulp.src('test/**/*.js')
    .pipe(coverage.instrument({pattern: ['lib/**/*.js']}))
    .pipe(mocha({reporter: 'spec'}))
    .pipe(coverage.gather())
    .pipe(coverage.format({outFile: 'coverage.html'}))
    .pipe(gulp.dest('.'))
    .pipe(coverage.enforce({
      statements: 95,
      blocks:     80, // web support drops us :(
      lines:      95,
    }));
});

// Flows

var jshintFlow = lazypipe()
  .pipe(jshint)
  .pipe(jshint.reporter, 'jshint-stylish')
  .pipe(jshint.reporter, 'fail');

// Transformation

function testForFile(file, callback) {
  if (file.path.indexOf(LIB_ROOT) !== 0) return callback(null, file);

  var testPath = path.join(TEST_ROOT, file.path.substr(LIB_ROOT.length));
  gulp.src(testPath)
    .on('data',  callback.bind(null, null))
    .on('error', callback);
}
