/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _        = require('lodash');
var async    = require('async');
var http     = require('http');
var socketIO = require('socket.io');

var BrowserRunner = require('./browserrunner');
var config        = require('./config');

// Steps (& Hooks)

function setupOverrides(context, done) {
  if (context.options.registerHooks) {
    context.options.registerHooks(context);
  }
  done();
}

function loadPlugins(context, done) {
  context.emit('log:debug', 'step: loadPlugins');
  context.plugins(function(error, plugins) {
    if (error) return done(error);
    // built in quasi-plugin.
    require('./webserver')(context);
    // Actual plugins.
    async.map(plugins, function(plugin, pluginDone) {
      return plugin.execute(context, pluginDone);
    }, done);
  });
}

function configure(context, done) {
  context.emit('log:debug', 'step: configure');
  var options = context.options;
  _.defaults(options, config.defaults());

  config.expand(context, function(error) {
    if (error) return done(error);

    // Note that we trigger the configure hook _after_ filling in the `options`
    // object.
    //
    // If you want to modify options prior to this; do it during plugin init.
    context.emitHook('configure', function(error) {
      if (error) return done(error);
      // Even if the options don't validate; useful debugging info.
      var cleanOptions = _.omit(options, 'output');
      context.emit('log:debug', 'configuration:', cleanOptions);

      config.validate(options, done);
    });
  });
}

/**
 * The prepare step is where a lot of the runner's initialization occurs. This
 * is also typically where a plugin will want to spin up any long-running
 * process it requires.
 *
 * Note that some "plugins" are also built directly into WCT (webserver).
 */
function prepare(context, done) {
  context.emitHook('prepare', done);
}

function runTests(context, done) {
  context.emit('log:debug', 'step: runTests');
  var failed = false;
  var runners = runBrowsers(context, function(error) {
    if (error) {
      done(error);
    } else {
      done(failed ? 'Had failed tests' : null);
    }
  });

  context._socketIOServer = socketIO(context._httpServer);
  context._socketIOServer.on('connection', function(socket) {
    context.emit('log:debug', 'Test client opened sideband socket');
    socket.on('client-event', function(data) {
      runners[data.browserId].onEvent(data.event, data.data);
    });
  });

  context._testRunners = runners;
}

function cancelTests(context) {
  if (!context._testRunners) {
    return;
  }
  context._testRunners.forEach(function(tr) {
    tr.quit();
  });
}

// Helpers

function runBrowsers(context, done) {
  var options = context.options;
  var numActiveBrowsers = options.activeBrowsers.length;
  if (numActiveBrowsers === 0) {
    throw new Error('No browsers configured to run');
  }

  // TODO(nevir): validate browser definitions.

  // Up the socket limit so that we can maintain more active requests.
  // TODO(nevir): We should be queueing the browsers above some limit too.
  http.globalAgent.maxSockets = Math.max(http.globalAgent.maxSockets, numActiveBrowsers * 2);

  context.emit('run-start', options);

  var errors  = [];
  var numDone = 0;
  return options.activeBrowsers.map(function(browser, id) {
    // Needed by both `BrowserRunner` and `CliReporter`.
    browser.id = id;
    _.defaults(browser, options.browserOptions);

    return new BrowserRunner(context, browser, options, function(error) {
      context.emit('log:debug', browser, 'BrowserRunner complete');
      if (error) errors.push(error);
      numDone = numDone + 1;
      if (numDone === numActiveBrowsers) {
        error = errors.length > 0 ? _.unique(errors).join(', ') : null;
        context.emit('run-end', error);
        // TODO(nevir): Better rationalize run-end and hook.
        context.emitHook('cleanup', function() {
          done(error);
        });
      }
    });
  });
}

module.exports = {
  configure:      configure,
  loadPlugins:    loadPlugins,
  prepare:        prepare,
  runTests:       runTests,
  cancelTests:    cancelTests,
  setupOverrides: setupOverrides,
};
