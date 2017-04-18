/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _      = require('lodash');
var chalk  = require('chalk');
var events = require('events');

var CliReporter = require('./clireporter');
var config      = require('./config');
var Context     = require('./context');
var Plugin      = require('./plugin');
var test        = require('./test');

var PACKAGE_INFO   = require('../package.json');
var updateNotifier;

(function() {
  try {
    updateNotifier = require('update-notifier')({
      pkg: PACKAGE_INFO
    });
  } catch (error) {
    // S'ok if we don't have update-notifier. It's optional.
  }
})();

function run(env, args, output, callback) {
  var done = wrapCallback(output, callback);

  // Options parsing is a two phase affair. First, we need an initial set of
  // configuration so that we know which plugins to load, etc:
  var options = config.preparseArgs(args);
  // Depends on values from the initial merge:
  options = config.merge(options, {
    output:    output,
    ttyOutput: !process.env.CI && output.isTTY && !options.simpleOutput,
  });
  var context = new Context(options);

  if (options.skipUpdateCheck) {
    updateNotifier = false;
  }

  // `parseArgs` merges any new configuration into `context.options`.
  config.parseArgs(context, args, function(error) {
    if (error) return done(error);
    test(context, done);
  });
}

// Note that we're cheating horribly here. Ideally all of this logic is within
// wct-sauce. The trouble is that we also want WCT's configuration lookup logic,
// and that's not (yet) cleanly exposed.
function runSauceTunnel(env, args, output, callback) {
  var done = wrapCallback(output, callback);

  var diskOptions = config.fromDisk();
  var baseOptions = diskOptions.plugins && diskOptions.plugins.sauce || diskOptions.sauce || {};

  Plugin.get('sauce', function(error, plugin) {
    if (error) return done(error);

    var parser = require('nomnom');
    parser.script('wct-st');
    parser.options(_.omit(plugin.cliConfig, 'browsers', 'tunnelId'));
    var options = _.merge(baseOptions, parser.parse(args));

    var wctSauce = require('wct-sauce');
    wctSauce.expandOptions(options);

    var emitter = new events.EventEmitter();
    new CliReporter(emitter, output, {});
    wctSauce.startTunnel(options, emitter, function(error, tunnelId) {
      if (error) return done(error); // Otherwise, we keep at it.
      output.write('\n');
      output.write('The tunnel will remain active while this process is running.\n');
      output.write('To use this tunnel for other WCT runs, export the following:\n');
      output.write('\n');
      output.write(chalk.cyan('export SAUCE_TUNNEL_ID=' + tunnelId) + '\n');
    });
  });
}

function wrapCallback(output, done) {
  return function(error) {
    if (!process.env.CI) {
      updateNotifier && updateNotifier.notify();
    }

    if (error) {
      output.write('\n');
      output.write(chalk.red(error) + '\n');
      output.write('\n');
    }
    done(error);
  };
}

module.exports = {
  run:            run,
  runSauceTunnel: runSauceTunnel,
};
