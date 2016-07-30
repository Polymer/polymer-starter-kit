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

 // Got problems? Try logging 'em
 // logging.setVerbose();

 const polymer = require('polymer-build');
 const PolymerProject = polymer.PolymerProject;
 const fork = polymer.forkStream;
 const addServiceWorker = polymer.addServiceWorker;

 const polymerJSON = require('./polymer.json');
 const project = new PolymerProject(polymerJSON);

 // Clean build directory
 gulp.task('clean', () => {
   return del('build');
 });

 gulp.task('build', ['clean'], (cb) => {
   // process source files in the project
   const sources = project.sources()
     .pipe(project.splitHtml())
     // add compilers or optimizers here!
     .pipe(gulpif('**/*.{png,gif,jpg,svg}', imagemin({
       progressive: true, interlaced: true
     })))
     .pipe(project.rejoinHtml());

   // process dependencies
   const dependencies = project.dependencies()
     .pipe(project.splitHtml())
     // add compilers or optimizers here!
     .pipe(project.rejoinHtml());

   // merge the source and dependencies streams to we can analyze the project
   const mergedFiles = mergeStream(sources, dependencies)
     .pipe(project.analyzer);

   // this fork will vulcanize the project
   const bundledPhase = fork(mergedFiles)
     .pipe(project.bundler)
     // write to the bundled folder
     .pipe(gulp.dest('build/bundled'));

   const unbundledPhase = fork(mergedFiles)
     // write to the unbundled folder
     .pipe(gulp.dest('build/unbundled'));

   cb();
 });

 gulp.task('service-worker', ['build'], () => {
   const swConfig = {
     navigateFallback: '/index.html',
   };

   // Once the unbundled build stream is complete, create a service worker for the build
   const unbundledPostProcessing = addServiceWorker({
     project: project,
     buildRoot: 'build/unbundled',
     swConfig: swConfig,
     serviceWorkerPath: 'service-worker.js',
   });

   // Once the bundled build stream is complete, create a service worker for the build
   const bundledPostProcessing = addServiceWorker({
     project: project,
     buildRoot: 'build/bundled',
     swConfig: swConfig,
     bundled: true,
   });
 });

 gulp.task('default', ['service-worker']);
