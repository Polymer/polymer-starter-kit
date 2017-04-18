/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _            = require('lodash');
var chalk        = require('chalk');
var cleankill    = require('cleankill');
var fs           = require('fs');
var path         = require('path');
var sauceConnect = require('sauce-connect-launcher');
var temp         = require('temp');
var uuid         = require('uuid');

/**
 * @param {!Object} config
 * @param {!EventEmitter} emitter
 * @param {function(*, string)} done
 */
function startTunnel(config, emitter, done) {
  if (!config.username || !config.accessKey) {
    return done('Missing Sauce credentials. Did you forget to set SAUCE_USERNAME and/or SAUCE_ACCESS_KEY?');
  }

  // If anything goes wrong, sc tends to have a bit more detail in its log, so
  // let's make that easy(ish) to get at:
  temp.mkdir('wct', function(error, logDir) {
    if (error) return done(error);
    var logPath = path.join(logDir, 'sc.log');

    var connectOptions = {
      username:         config.username,
      accessKey:        config.accessKey,
      tunnelIdentifier: uuid.v4(),
      logger:           emitter.emit.bind(emitter, 'log:debug'),
      logfile:          logPath,
      port:             config.port
    };
    _.assign(connectOptions, config.tunnelOptions);
    var tunnelId = connectOptions.tunnelIdentifier;

    emitter.emit('log:info', 'Creating Sauce Connect tunnel');
    emitter.emit('log:info', 'Sauce Connect log:', chalk.magenta(logPath));

    setSauceConnectDownloadVersion();

    sauceConnect(connectOptions, function(error, tunnel) {
      if (error) {
        emitter.emit('log:error', 'Sauce tunnel failed:');
      } else {
        emitter.emit('log:info', 'Sauce tunnel active:', chalk.yellow(tunnelId));
        emitter.emit('sauce:tunnel-active', tunnelId);
      }
      done(error, tunnelId);
    });
    // SauceConnectLauncher only supports one tunnel at a time; this allows us to
    // kill it before we've gotten our callback.
    cleankill.onInterrupt(sauceConnect.kill.bind(sauceConnect));
  });
}

function isTravisSauceConnectRunning() {
  // https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
  if (!process.env.TRAVIS) {
    return false;
  }

  try {
    // when using the travis sauce_connect addon, the file
    // /home/travis/sauce-connect.log is written to with the sauce logs.
    // If this file exists, then the sauce_connect addon is in use
    // If fs.statSync throws, then the file does not exist
    var travisScLog = path.join(process.env.HOME, 'sauce-connect.log');
    if (fs.statSync(travisScLog)) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// sauce-connect-launcher only checks the environment variable
// $SAUCE_CONNECT_VERSION
function setSauceConnectDownloadVersion() {
  process.env.SAUCE_CONNECT_VERSION = '4.3.13';
}

module.exports = {
  startTunnel: startTunnel,
  isTravisSauceConnectRunning: isTravisSauceConnectRunning,
  setSauceConnectDownloadVersion: setSauceConnectDownloadVersion
};
