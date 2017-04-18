/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var gulp   = require('gulp');
var jshint = require('gulp-jshint');

var MAIN_SOURCES = ['gulpfile.js', '{lib,test}/**/*.js'];

gulp.task('default', ['test']);

gulp.task('test', ['test:style']);

gulp.task('test:style', function() {
  return gulp.src(MAIN_SOURCES)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
