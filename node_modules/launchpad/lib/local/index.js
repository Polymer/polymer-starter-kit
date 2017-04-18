var _ = require('underscore');
var Q = require('q');
var debug = require('debug')('launchpad:local');

var instance = require('./instance');
var getBrowser = require('./browser');
var getVersion = require('./version');
var platform = require('./platform');

var normalize = function(browser) {
  return _.pick(browser, 'name', 'version', 'path', 'binPath');
};

var tmpdir = process.env.TMPDIR || process.env.TMP;
var cleanLaunch = {
  firefox: ['-no-remote', '-silent', '-p', 'launchpad-firefox'],
  opera: ['-nosession'],
  chrome: ['--no-default-browser-check', '--no-first-run', '--user-data-dir=' + tmpdir]
};

module.exports = function (settings, callback) {
	if (!callback) {
		callback = settings;
		settings = undefined;
	}

  debug('Initializing local launchers', settings);
  var api = function(url, options, callback) {
    var name = options.browser;

    debug('Launching browser', url, options);
    getBrowser(_.extend({ name: name }, platform[name])).then(function(browser) {
      if(browser === null) {
        return Q.reject(new Error('Browser ' + name + ' not available.'));
      }

      var args = browser.args || [];
      if(options.clean && cleanLaunch[name]) {
        args = args.concat(cleanLaunch[name]);
      }

      if(options.args) {
        args = args.concat(options.args);
      }
      
      // Convert the command if set (some browsers need some customization)
      if(browser.getCommand) {
        browser.command = browser.getCommand(browser, url, args, options);
        args = null;
      } else {
        args = args.concat(url);
      }

      debug('Starting Browser', browser.name);
      return Q.ninvoke(instance, 'start', browser.command, args, settings, browser);
    }).nodeify(callback);
  };

  api.browsers = function(callback) {
    var deferreds = _.map(platform, function(browser, name) {
      return getBrowser(_.extend({ name: name }, browser)).then(getVersion);
    });

    Q.all(deferreds).then(function(browsers) {
      debug('Listed all browsers (before normalization)', browsers);
      return _.map(_.compact(browsers), normalize);
    }).nodeify(callback);
  };

  _.each(platform, function(browser, name) {
    api[name] = function(url, options, callback) {
      if(!callback) {
        callback = options;
        options = {};
      }

      options.browser = name;

      return api(url, options, callback);
    };
  });

  callback(null, api);
};

module.exports.platform = platform;
