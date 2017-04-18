/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var chalk = require('chalk');

var test = require('./test');

function init(gulp, dependencies) {
  if (!dependencies) dependencies = [];

  // TODO(nevir): Migrate fully to wct:local/etc.
  gulp.task('test',        ['wct:local']);
  gulp.task('test:local',  ['wct:local']);
  gulp.task('test:remote', ['wct:sauce']);

  gulp.task('wct', ['wct:local']);

  gulp.task('wct:local', dependencies, function(done) {
    test({plugins: {local: {},   sauce: false}}, cleanDone(done));
  });

  gulp.task('wct:sauce', dependencies, function(done) {
    test({plugins: {local: false, sauce: {}}},   cleanDone(done));
  });
}

// Utility

function cleanDone(done) {
  return function(error) {
   if (error) {
      // Pretty error for gulp.
      error = new Error(chalk.red(error.message || error));
      error.showStack = false;
    }
    done(error);
  };
}

// Exports

module.exports = {
  init: init,
};
