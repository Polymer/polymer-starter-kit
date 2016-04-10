/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var async     = require('async');
var cleankill = require('cleankill');

var CliReporter = require('./clireporter');
var Context     = require('./context');
var steps       = require('./steps');

/**
 * Runs a suite of web component tests.
 *
 * The returned Context (a kind of EventEmitter) fires various events to allow
 * you to track the progress of the tests:
 *
 * Lifecycle Events:
 *
 * `run-start`
 *   WCT is ready to begin spinning up browsers.
 *
 * `browser-init` {browser} {stats}
 *   WCT is ready to begin spinning up browsers.
 *
 * `browser-start` {browser} {metadata} {stats}
 *   The browser has begun running tests. May fire multiple times (i.e. when
 *   manually refreshing the tests).
 *
 * `sub-suite-start` {browser} {sharedState} {stats}
 *   A suite file has begun running.
 *
 * `test-start` {browser} {test} {stats}
 *   A test has begun.
 *
 * `test-end` {browser} {test} {stats}
 *  A test has ended.
 *
 * `sub-suite-end` {browser} {sharedState} {stats}
 *   A suite file has finished running all of its tests.
 *
 * `browser-end` {browser} {error} {stats}
 *   The browser has completed, and it shutting down.
 *
 * `run-end` {error}
 *   WCT has run all browsers, and is shutting down.
 *
 * Generic Events:
 *
 *  * log:debug
 *  * log:info
 *  * log:warn
 *  * log:error
 *
 * @param {!Object|!Context} options The configuration, as specified in,
 *     `./config.js` or an already formed `Context` object.
 * @param {function(*)} done callback indicating error or success.
 * @return {!Context}
 */
module.exports = function test(options, done) {
  var context = (options instanceof Context) ? options : new Context(options);

  // We assume that any options related to logging are passed in via the initial
  // `options`.
  if (context.options.output) {
    new CliReporter(context, context.options.output, context.options);
  }

  async.series([
    steps.setupOverrides.bind(steps, context),
    steps.loadPlugins.bind(steps, context),
    steps.configure.bind(steps, context),
    steps.prepare.bind(steps, context),
    steps.runTests.bind(steps, context),
  ], function(error) {
    if (options.skipCleanup) {
      done(error);
    } else {
      cleankill.close(done.bind(null, error));
    }
  });

  return context;
};
