/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _         = require('lodash');
var launchpad = require('launchpad');

var LAUNCHPAD_TO_SELENIUM = {
  chrome:  chrome,
  canary:  chrome,
  firefox: firefox,
  aurora:  firefox,
  ie:      internetExplorer,
  // Until https://code.google.com/p/selenium/issues/detail?id=7933
  safari:  safari,
};

/**
 * @param {Array<string|!Object>} browsers
 * @return {!Array<string>}
 */
function normalize(browsers) {
  return (browsers || []).map(function(browser) {
    return browser.browserName || browser;
  });
}

/**
 * Expands an array of browser identifiers for locally installed browsers into
 * their webdriver capabilities objects.
 *
 * If `names` is empty, or contains `all`, all installed browsers will be used.
 *
 * @param {!Array<string>} names
 * @param {function(*, Array<!Object>)} done
 */
function expand(names, done) {
  if (names.indexOf('all') !== -1) {
    names = [];
  }

  var unsupported = _.difference(names, module.exports.supported());
  if (unsupported.length > 0) {
    return done(
        'The following browsers are unsupported: ' + unsupported.join(', ') + '. ' +
        '(All supported browsers: ' + module.exports.supported().join(', ') + ')'
    );
  }

  module.exports.detect(function(error, installedByName) {
    if (error) return done(error);
    var installed = _.keys(installedByName);
    // Opting to use everything?
    if (names.length === 0) {
      names = installed;
    }

    var missing   = _.difference(names, installed);
    if (missing.length > 0) {
      return done(
          'The following browsers were not found: ' + missing.join(', ') + '. ' +
          '(All installed browsers found: ' + installed.join(', ') + ')'
      );
    }

    done(null, names.map(function(n) { return installedByName[n]; }));
  });
}

/**
 * Detects any locally installed browsers that we support.
 *
 * @param {function(*, Object<string, !Object>)} done
 */
function detect(done) {
  launchpad.local(function(error, launcher) {
    if (error) return done(error);
    launcher.browsers(function(error, browsers) {
      if (error) return done(error);

      var results = {};
      for (var i = 0, browser; browser = browsers[i]; i++) {
        if (!LAUNCHPAD_TO_SELENIUM[browser.name]) continue;
        results[browser.name] = LAUNCHPAD_TO_SELENIUM[browser.name](browser);
      }

      done(null, results);
    });
  });
}

/**
 * @return {!Array<string>} A list of local browser names that are supported by
 *     the current environment.
 */
function supported() {
  return _.intersection(_.keys(launchpad.local.platform), _.keys(LAUNCHPAD_TO_SELENIUM));
}

// Launchpad -> Selenium

/**
 * @param {!Object} browser A launchpad browser definition.
 * @return {!Object} A selenium capabilities object.
 */
function chrome(browser) {
  return {
    'browserName': 'chrome',
    'version':     browser.version.match(/\d+/)[0],
    'chromeOptions': {
      'binary': browser.binPath,
      'args': ['start-maximized']
    },
  };
}

/**
 * @param {!Object} browser A launchpad browser definition.
 * @return {!Object} A selenium capabilities object.
 */
function firefox(browser) {
  return {
    'browserName':    'firefox',
    'version':        browser.version.match(/\d+/)[0],
    'firefox_binary': browser.binPath,
  };
}

/**
 * @param {!Object} browser A launchpad browser definition.
 * @return {!Object} A selenium capabilities object.
 */
function safari(browser) {
  // SafariDriver doesn't appear to support custom binary paths. Does Safari?
  return {
    'browserName': 'safari',
    'version':     browser.version,
    // TODO(nevir): TEMPORARY. https://github.com/Polymer/web-component-tester/issues/51
    'safari.options': {
      'skipExtensionInstallation': true,
    },
  };
}

/**
 * @param {!Object} browser A launchpad browser definition.
 * @return {!Object} A selenium capabilities object.
 */
function internetExplorer(browser) {
  return {
    'browserName': 'internet explorer',
    'version':     browser.version,
  };
}

module.exports = {
  normalize: normalize,
  detect:    detect,
  expand:    expand,
  supported: supported,
};
