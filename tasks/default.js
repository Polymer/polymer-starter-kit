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
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const logging = require('plylog');
const mergeStream = require('merge-stream');

const polymer = require('polymer-build');

// Got problems? Try logging 'em
// logging.setVerbose();

const PolymerProject = polymer.PolymerProject;
const fork = polymer.forkStream;

let polymerJSON = require('../polymer.json');
let project = new PolymerProject(polymerJSON);

gulp.task('default', () => {

  // process source files in the project
  let sources = project.sources()
    .pipe(project.splitHtml())
    // add compilers or optimizers here!
    .pipe(gulpif('**/*.{png,gif,jpg,svg}', imagemin({
      progressive: true, interlaced: true
    })))
    .pipe(project.rejoinHtml());

  // process dependencies
  let dependencies = project.dependencies()
    .pipe(project.splitHtml())
    // add compilers or optimizers here!
    .pipe(project.rejoinHtml());

  // merge the source and dependencies streams to we can analyze the project
  let allFiles = mergeStream(sources, dependencies)
    .pipe(project.analyze);

  // fork the stream in case downstream transformers mutate the files
  // this fork will vulcanize the project
  let bundled = fork(allFiles)
    .pipe(project.bundle)
    // write to the bundled folder
    .pipe(gulp.dest('build/bundled'));

  let unbundled = fork(allFiles)
    // write to the unbundled folder
    .pipe(gulp.dest('build/unbundled'));

  return mergeStream(bundled, unbundled);
});
