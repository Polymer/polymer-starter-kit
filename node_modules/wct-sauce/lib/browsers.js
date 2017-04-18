/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _ = require('lodash');

var ALL_BROWSERS = require('../default-sauce-browsers.json');

var TRAVIS_BROWSERS = require('../travis-browsers.json');

// if running under travis, ENV{TRAVIS} = true, use the travis browser set
var DEFAULT_BROWSERS = process.env.TRAVIS ? TRAVIS_BROWSERS : ALL_BROWSERS;

// "<PLATFORM>/<BROWSER>[@<VERSION>]"
var BROWSER_SPEC = /^([^\/@]+)\/([^\/@]+)(?:@(.*))?$/;

var PROPERTY_BLACKLIST = ['accessKey', 'browsers', 'disabled', 'username'];

/**
 * Expands an array of browser identifiers for sauce browsers into their
 * webdriver capabilities objects.
 *
 * @param {!Object} pluginOptions
 * @param {function(*, Array<!Object>)} done
 */
function expand(pluginOptions, done) {
  var browsers = pluginOptions.browsers;
  // 'all' is really 'default', just to be consistent with wct-local.
  if (browsers.indexOf('default') !== -1 || browsers.indexOf('all') !== -1) {
    // TODO(nevir): Figure out the latest version of each browser and pick
    // appropriate spreads of versions & OSes.
    browsers = browsers.concat(_.cloneDeep(DEFAULT_BROWSERS));
    browsers = _.difference(browsers, ['default', 'all']);
  }

  done(null, _.compact(browsers.map(_expandBrowser.bind(
    null,
    pluginOptions,
    _.omit(pluginOptions, PROPERTY_BLACKLIST)
  ))));
}

/**
 * @param {string} username
 * @param {string} accessKey
 * @param {!Object} options
 * @param {string|!Object} browser
 * @return {Object}
 */
function _expandBrowser(options, extend, browser) {
  if (!_.isObject(browser)) {
    var match = _.isString(browser) && browser.match(BROWSER_SPEC);

    if (!match) {
      console.log('Invalid sauce browser spec:', browser);
      return null;
    }
    else {
      browser = {
        browserName: match[2],
        platform:    match[1],
        version:     match[3] || '',
      };
    }
  }

  return _.extend(browser, {
    url: {
      accessKey: options.accessKey,
      hostname:  'ondemand.saucelabs.com',
      port:      80,
      username:  options.username,
    },
  }, extend);
}

module.exports = {
  expand: expand,
};
