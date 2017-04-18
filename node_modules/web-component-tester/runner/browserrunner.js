/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _         = require('lodash');
var chalk     = require('chalk');
var cleankill = require('cleankill');
var wd        = require('wd');

// Browser abstraction, responsible for spinning up a browser instance via wd.js and
// executing runner.html test files passed in options.files
function BrowserRunner(emitter, capabilities, options, doneCallback) {
  this.timeout = options.testTimeout;
  this.emitter = emitter;
  this.options = options;
  this.def     = capabilities;
  this.doneCallback = doneCallback;

  this.stats   = {status: 'initializing'};
  this.browser = wd.remote(this.def.url);

  // never retry selenium commands
  this.browser.configureHttp({
    retries: -1
  });

  cleankill.onInterrupt(function(done) {
    if (!this.browser) return done();

    var origDoneCallback = this.doneCallback;
    this.doneCallback = function(error, runner) {
      done();
      origDoneCallback(error, runner);
    };
    this.done('Interrupting');
  }.bind(this));

  this.browser.on('command', function(method, context) {
    emitter.emit('log:debug', this.def, chalk.cyan(method), context);
  }.bind(this));

  this.browser.on('http', function(method, path, data) {
    if (data) {
      emitter.emit('log:debug', this.def, chalk.magenta(method), chalk.cyan(path), data);
    } else {
      emitter.emit('log:debug', this.def, chalk.magenta(method), chalk.cyan(path));
    }
  }.bind(this));

  this.browser.on('connection', function(code, message, error) {
    emitter.emit('log:warn', this.def, 'Error code ' + code + ':', message, error);
  }.bind(this));

  this.emitter.emit('browser-init', this.def, this.stats);

  // Make sure that we are passing a pristine capabilities object to webdriver.
  // None of our screwy custom properties!
  var webdriverCapabilities = _.clone(this.def);
  delete webdriverCapabilities.id;
  delete webdriverCapabilities.url;
  delete webdriverCapabilities.sessionId;

  // Reusing a session?
  if (this.def.sessionId) {
    this.browser.attach(this.def.sessionId, function(error) {
      this._init(error, this.def.sessionId);
    }.bind(this));
  } else {
    this.browser.init(webdriverCapabilities, this._init.bind(this));
  }
}

BrowserRunner.prototype._init = function _init(error, sessionId) {
  if (!this.browser) return; // When interrupted.
  if (error) {
    // TODO(nevir): BEGIN TEMPORARY CHECK. https://github.com/Polymer/web-component-tester/issues/51
    if (this.def.browserName === 'safari' && error.data) {
      // debugger;
      try {
        var data = JSON.parse(error.data);
        console.log(data.value.message);
        if (data.value && data.value.message && /Failed to connect to SafariDriver/i.test(data.value.message)) {
          error = 'Until Selenium\'s SafariDriver supports Safari 6.2+, 7.1+, & 8.0+, you must\n' +
                  'manually install it. Follow the steps at:\n' +
                  'https://github.com/SeleniumHQ/selenium/wiki/SafariDriver#getting-started';
        }
      } catch (error) {
        // Show the original error.
      }
    }
    // END TEMPORARY CHECK
    this.done(error.data || error);
  } else {
    this.sessionId = sessionId;
    this.startTest();
    this.extendTimeout();
  }
};

BrowserRunner.prototype.startTest = function startTest() {
  var host  = 'http://' + this.options.webserver.hostname + ':' + this.options.webserver.port;
  var path  = this.options.webserver.webRunnerPath;
  var extra = (path.indexOf('?') === -1 ? '?' : '&') + 'cli_browser_id=' + this.def.id;
  this.browser.get(host + path + extra, function(error) {
    if (error) {
      this.done(error.data || error);
    } else {
      this.extendTimeout();
    }
  }.bind(this));
};

BrowserRunner.prototype.onEvent = function onEvent(event, data) {
  this.extendTimeout();

  if (event === 'browser-start') {
    // Always assign, to handle re-runs (no browser-init).
    this.stats = {
      status:  'running',
      passing: 0,
      pending: 0,
      failing: 0,
    };
  } else if (event === 'test-end') {
    this.stats[data.state] = this.stats[data.state] + 1;
  }

  if (event === 'browser-end') {
    this.done(data);
  } else {
    this.emitter.emit(event, this.def, data, this.stats, this.browser);
  }
};

BrowserRunner.prototype.done = function done(error) {
  // No quitting for you!
  if (this.options.persistent) return;

  if (this.timeoutId) clearTimeout(this.timeoutId);
  // Don't double-quit.
  if (!this.browser) return;
  var browser = this.browser;
  this.browser = null;

  this.stats.status = error ? 'error' : 'complete';
  if (!error && this.stats.failing > 0) {
    error = this.stats.failing + ' failed tests';
  }

  this.emitter.emit('browser-end', this.def, error, this.stats, this.sessionId, browser);

  // Nothing to quit.
  if (!this.sessionId) {
    return this.doneCallback(error, this);
  }

  browser.quit(function(quitError) {
    if (quitError) {
      this.emitter.emit('log:warn', this.def, 'Failed to quit:', quitError.data || quitError);
    }
    this.doneCallback(error, this);
  }.bind(this));
};

BrowserRunner.prototype.extendTimeout = function extendTimeout() {
  if (this.options.persistent) return;
  if (this.timeoutId) clearTimeout(this.timeoutId);
  this.timeoutId = setTimeout(function() {
    this.done('Timed out');
  }.bind(this), this.timeout);
};

BrowserRunner.prototype.quit = function quit() {
  this.done('quit was called');
};

module.exports = BrowserRunner;
