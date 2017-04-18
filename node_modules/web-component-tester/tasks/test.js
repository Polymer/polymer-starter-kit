/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var chalk  = require('chalk');

var test = require('../runner/test');

module.exports = function(grunt) {
  grunt.registerMultiTask('wct-test', 'Runs tests via web-component-tester', function() {
    var done = this.async();
    test(this.options(), function(error) {
      if (error) {
        console.log(chalk.red(error));
        // Grunt only errors on `false` and instances of `Error`.
        done(new Error(error));
      } else {
        done();
      }
    });
  });
};
