/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');

// Lint JavaScript
gulp.task('lint', () => {
  let filesToLint = [
    'gulpfile.js',
    'gulp-tasks/**/*.js',
    'index.html',
    'src/**/*.{js,html}',
    'test/**/*.{js,html}'
  ];

  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
