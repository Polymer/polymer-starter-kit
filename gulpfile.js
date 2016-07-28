/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 *
 * Based on: https://github.com/Polymer/polymer-build/blob/master/test/test-project/gulpfile.js
 */

'use strict';

const del = require('del');
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
const addServiceWorker = polymer.addServiceWorker;

// Waits for the given ReadableStream
function waitFor(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

let polymerJSON = require('./polymer.json');
let project = new PolymerProject(polymerJSON);

// Clean build directory
gulp.task('clean', () => {
  return del(['build/**','!build']);
});

gulp.task('default',['clean'], (cb) => {

  let swConfig = {
    staticFileGlobs: [
      'index.html',
      'src/psk-app.html',
      'src/**',
    ],
    navigateFallback: '/index.html',
  };

  // process source files in the project
  let sources = project.sources()
    .pipe(project.splitHtml())
    // add compilers or optimizers here!
    .pipe(gulpif('**/*.{png,gif,jpg,svg}', imagemin({
      progressive: true, interlaced: true
    })))
    .pipe(project.rejoinHtml());
    // console.log('sources: ',sources);

  // process dependencies
  let dependencies = project.dependencies()
    .pipe(project.splitHtml())
    // add compilers or optimizers here!
    .pipe(project.rejoinHtml());

  // merge the source and dependencies streams to we can analyze the project
  let allFiles = mergeStream(sources, dependencies)
    .pipe(project.analyzer);

  // fork the stream in case downstream transformers mutate the files
  // this fork will vulcanize the project
  let bundledPhase = fork(allFiles)
    .pipe(project.bundler)
    // write to the bundled folder
    .pipe(gulp.dest('build/bundled'));

  let unbundledPhase = fork(allFiles)
    // write to the unbundled folder
    .pipe(gulp.dest('build/unbundled'));

  // Once the unbundled build stream is complete, create a service worker for the build
  let unbundledPostProcessing = waitFor(unbundledPhase).then(() => {
    return addServiceWorker({
      project: project,
      buildRoot: 'build/unbundled',
      swConfig: swConfig,
      serviceWorkerPath: 'service-worker.js',
    });
  });

  // Once the bundled build stream is complete, create a service worker for the build
  let bundledPostProcessing = waitFor(bundledPhase).then(() => {
    return addServiceWorker({
      project: project,
      buildRoot: 'build/bundled',
      swConfig: swConfig,
      bundled: true,
    });
  });

  return Promise.all([unbundledPostProcessing, bundledPostProcessing]);
});
