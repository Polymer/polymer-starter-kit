/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var browsers = require('./browsers');
var selenium = require('./selenium');

/** WCT plugin that enables support for local browsers via Selenium. */
module.exports = function(wct, pluginOptions) {

  // The capabilities objects for browsers to run. We don't know the port until
  // `prepare`, so we've gotta hang onto them.
  var eachCapabilities = [];

  // Convert any local browser names into Webdriver capabilities objects.
  //
  // Note that we run this hook late to allow other plugins to append their
  // browsers. We don't want the default behavior (run all local browsers) to
  // kick in if someone has specified browsers via another plugin.
  wct.hookLate('configure', function(done) {
    pluginOptions.seleniumArgs = pluginOptions.seleniumArgs || [];
    pluginOptions.skipSeleniumInstall = pluginOptions.skipSeleniumInstall || false;

    var names = browsers.normalize(pluginOptions.browsers);
    if (names.length > 0) {
      // We support comma separated browser identifiers for convenience.
      names = names.join(',').split(',');
    }

    var activeBrowsers = wct.options.activeBrowsers;
    if (activeBrowsers.length === 0 && names.length === 0) {
      names = ['all'];
    }
    // No local browsers for you :(
    if (names.length === 0) return done();

    // Note that we **do not** append the browsers to `activeBrowsers`
    // until we've got a port chosen for the Selenium server.
    browsers.expand(names, function(error, expanded) {
      if (error) return done(error);
      wct.emit('log:debug', 'Expanded local browsers:', names, 'into capabilities:', expanded);
      eachCapabilities = expanded;
      // We are careful to append these to the configuration object, even though
      // we don't know the selenium port yet. This allows WCT to give a useful
      // error if no browsers were configured.
      activeBrowsers.push.apply(activeBrowsers, expanded);

      done();
    });
  });

  wct.hook('prepare', function(done) {
    if (!eachCapabilities.length) return done();

    wct.emitHook('prepare:selenium', function(error) {
      if (error) return done(error);
      selenium.checkSeleniumEnvironment(function(error) {
        if (error) return done(error);
        var start = selenium.installAndStartSeleniumServer;
        if(pluginOptions.skipSeleniumInstall) {
          start = selenium.startSeleniumServer;
        }
        start(wct, pluginOptions.seleniumArgs, function(error, port) {
          if (error) return done(error);
          updatePort(eachCapabilities, port);
          done();
        });
      });
    });

  });

  wct.on('browser-start', function(def, data, stats, browser) {
    if (!browser) return;
    browser.maximize(function(err) {
      if (err) {
        wct.emit('log:error', def.browserName + ' failed to maximize');
      } else {
        wct.emit('log:debug', def.browserName + ' maximized');
      }
    });
  });

};

// Utility

/**
 * @param {!Array.<!Object>} eachCapabilities
 * @param {number} port
 */
function updatePort(eachCapabilities, port) {
  eachCapabilities.forEach(function(capabilities) {
    capabilities.url = {
      hostname: '127.0.0.1',
      port:     port,
    };
  });
}
