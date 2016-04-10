/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _       = require('lodash');
var request = require('request');

var browsers = require('./browsers');
var sauce    = require('./sauce');

/** WCT plugin that enables support for remote browsers via Sauce Labs. */
module.exports = function(wct, pluginOptions) {

  // The capabilities objects for browsers to run. We don't know the tunnel id
  // until `prepare`, so we've gotta hang onto them.
  var eachCapabilities = [];

  wct.hook('configure', function(done) {
    if (!pluginOptions.browsers || pluginOptions.browsers.length === 0) return done();

    expandOptions(pluginOptions);

    browsers.expand(pluginOptions, function(error, expanded) {
      if (error) return done(error);
      wct.emit('log:debug', 'Using sauce browsers:', expanded);
      // We are careful to append these to the configuration object, even though
      // we don't know the tunnel id yet. This allows WCT to give a useful error
      // if no browsers were configured.
      var activeBrowsers = wct.options.activeBrowsers;
      activeBrowsers.push.apply(activeBrowsers, expanded);
      // But we still need to inject the sauce tunnel ID once we know it.
      eachCapabilities = expanded;

      done();
    });
  });

  wct.hook('prepare', function(done) {
    // Don't bother spinning up the tunnel if we don't have any browsers talking
    // over it.
    if (eachCapabilities.length === 0) return done();

    // Is there already an active sauce tunnel?
    if (pluginOptions.tunnelId) {
      _injectTunnelId(eachCapabilities, pluginOptions.tunnelId);
      return done();
    }

    // Let anyone know, and give them a chance to modify the options prior to
    // booting up the Sauce Connect tunnel.
    wct.emitHook('prepare:sauce-tunnel', function(error) {
      if (error) return done(error);
      sauce.startTunnel(pluginOptions, wct, function(error, tunnelId) {
        if (error) return done(error);
        _injectTunnelId(eachCapabilities, tunnelId);
        done();
      });
    });
  });

  wct.on('browser-start', function(def, data, stats, browser) {
    if (!browser) return;
    // Bump the connection periodically to advance Sauce's remote timeout.
    browser._keepalive = setInterval(function(){
      browser.title(function() {});
    }, (def.testTimeout / 2) || 45 * 1000);
    // do not let the keepalive hang node
    browser._keepalive.unref();
  });

  wct.on('browser-end', function(def, error, stats, sessionId, browser) {
    if (eachCapabilities.length === 0 || !sessionId) return;

    if (browser._keepalive) {
      clearInterval(browser._keepalive);
    }

    var payload = {
      passed: (stats.status === 'complete' && stats.failing === 0),
      'public': pluginOptions.visibility,
      build: parseInt(pluginOptions.buildNumber, 10),
      name: pluginOptions.jobName
    };
    wct.emit('log:debug', 'Updating sauce job', sessionId, payload);

    // Send the pass/fail info to sauce-labs if we are testing remotely.
    var username  = wct.options.plugins.sauce.username;
    var accessKey = wct.options.plugins.sauce.accessKey;
    request.put({
      url:  'https://saucelabs.com/rest/v1/' + encodeURIComponent(username) + '/jobs/' + encodeURIComponent(sessionId),
      auth: {user: username, pass: accessKey},
      json: true,
      body: payload,
    });
  });

};

function expandOptions(options) {
  _.defaults(options, {
    username:  process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    tunnelId:  process.env.SAUCE_TUNNEL_ID,
    // export the travis build number (integer) and repo slug (user/repo) to
    // sauce dashboard
    buildNumber: process.env.TRAVIS_BUILD_NUMBER,
    jobName: process.env.TRAVIS_REPO_SLUG,
    visibility: 'public'
  });
  if (sauce.isTravisSauceConnectRunning()) {
    _.defaults(options, {
      // Under Travis CI, the tunnel id is $TRAVIS_JOB_NUMBER: https://docs.travis-ci.com/user/sauce-connect
      tunnelId: process.env.TRAVIS_JOB_NUMBER
    });
  }
}

/**
 * @param {!Array<!Object>} eachCapabilities
 * @param {string} tunnelId
 */
function _injectTunnelId(eachCapabilities, tunnelId) {
  eachCapabilities.forEach(function(browser) {
    browser['tunnel-identifier'] = tunnelId;
  });
}

// Hacks for the wct-st binary.
module.exports.expandOptions = expandOptions;
module.exports.startTunnel   = sauce.startTunnel;
