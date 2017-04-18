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
var stacky    = require('stacky');
var util      = require('util');

var STACKY_CONFIG = {
  indent: '    ',
  locationStrip: [
    /^https?:\/\/[^\/]+/,
    /\?[\d\.]+$/,
  ],
  unimportantLocation: [
    /^\/web-component-tester\//,
  ]
};

var STATE_ICONS = {
  passing: '✓',
  pending: '✖',
  failing: '✖',
  unknown: '?',
};

var STATE_COLORS = {
  passing: chalk.green,
  pending: chalk.yellow,
  failing: chalk.red,
  unknown: chalk.red,
  error:   chalk.red,
};

var SHORT = {
  'internet explorer': 'IE',
};

var BROWSER_PAD = 24;
var STATUS_PAD  = 38;

function CliReporter(emitter, stream, options) {
  this.emitter = emitter;
  this.stream  = stream;
  this.options = options;

  this.prettyBrowsers = {};
  this.browserStats   = {};

  cleankill.onInterrupt(function(done) {
    this.flush();
    done();
  }.bind(this));

  emitter.on('log:info',  this.log.bind(this));
  emitter.on('log:warn',  this.log.bind(this, chalk.yellow));
  emitter.on('log:error', this.log.bind(this, chalk.red));

  if (this.options.verbose) {
    emitter.on('log:debug', this.log.bind(this, chalk.dim));
  }

  emitter.on('browser-init', function(browser, stats) {
    this.browserStats[browser.id]   = stats;
    this.prettyBrowsers[browser.id] = this.prettyBrowser(browser);
    this.updateStatus();
  }.bind(this));

  emitter.on('browser-start', function(browser, data, stats) {
    this.browserStats[browser.id] = stats;
    this.log(browser, 'Beginning tests via', chalk.magenta(data.url));
    this.updateStatus();
  }.bind(this));

  emitter.on('test-end', function(browser, data, stats) {
    this.browserStats[browser.id] = stats;
    if (data.state === 'failing') {
      this.writeTestError(browser, data);
    } else if (this.options.expanded || this.options.verbose) {
      this.log(browser, this.stateIcon(data.state), this.prettyTest(data));
    }

    this.updateStatus();
  }.bind(this));

  emitter.on('browser-end', function(browser, error, stats) {
    this.browserStats[browser.id] = stats;
    if (error) {
      this.log(chalk.red, browser, 'Tests failed:', error);
    } else {
      this.log(chalk.green, browser, 'Tests passed');
    }
  }.bind(this));

  emitter.on('run-end', function(error) {
    if (error) {
      this.log(chalk.red, 'Test run ended in failure:', error);
    } else {
      this.log(chalk.green, 'Test run ended with great success');
    }

    if (!this.options.ttyOutput) {
      this.updateStatus(true);
    }
  }.bind(this));
}

// Specialized Reporting

CliReporter.prototype.updateStatus = function(force) {
  if (!this.options.ttyOutput && !force) return;
  // EXTREME TERMINOLOGY FAIL, but here's a glossary:
  //
  // stats:  An object containing test stats (total, passing, failing, etc).
  // state:  The state that the run is in (running, etc).
  // status: A string representation of above.
  var statuses = Object.keys(this.browserStats).map(function(browserId) {
    var pretty = this.prettyBrowsers[browserId];
    var stats  = this.browserStats[browserId];

    var status = '';
    var counts = [stats.passing, stats.pending, stats.failing];
    if (counts[0] > 0 || counts[1] > 0 || counts[2] > 0) {
      if (counts[0] > 0) counts[0] = chalk.green(counts[0]);
      if (counts[1] > 0) counts[1] = chalk.yellow(counts[1]);
      if (counts[2] > 0) counts[2] = chalk.red(counts[2]);
      status = counts.join('/');
    }
    if (stats.status === 'error') {
      status = status + (status === '' ? '' : ' ') + chalk.red('error');
    }

    return padRight(pretty + ' (' + status + ')', STATUS_PAD);
  }.bind(this));

  this.writeWrapped(statuses, '  ');
};

CliReporter.prototype.writeTestError = function(browser, data) {
  this.log(browser, this.stateIcon(data.state), this.prettyTest(data, chalk.yellow));

  var error = data.error || {};
  this.write('\n');

  var prettyMessage = error.message || error;
  if (typeof prettyMessage !== 'string') {
    prettyMessage = util.inspect(prettyMessage);
  }
  this.write(chalk.red('  ' + prettyMessage));

  if (error.stack) {
    try {
      this.write(stacky.pretty(data.error.stack, STACKY_CONFIG));
    } catch (err) {
      // If we couldn't extract a stack (i.e. there was no stack), the message
      // is enough.
    }
  }
  this.write('\n');
};

// Object Formatting

CliReporter.prototype.stateIcon = function stateIcon(state) {
  var color = STATE_COLORS[state] || STATE_COLORS.unknown;
  return color(STATE_ICONS[state] || STATE_ICONS.unknown);
};

CliReporter.prototype.prettyTest = function prettyTest(data) {
  var color = STATE_COLORS[data.state] || STATE_COLORS.unknown;
  return color(data.test.join(' » ') || '<unknown test>');
};

CliReporter.prototype.prettyBrowser = function prettyBrowser(browser) {
  parts = [];

  if (browser.platform && !browser.deviceName) {
    parts.push(browser.platform);
  }

  var name = browser.deviceName || browser.browserName;
  parts.push(SHORT[name] || name);

  if (browser.version) {
    parts.push(browser.version);
  }

  return chalk.blue(parts.join(' '));
};

// Yeah, yeah.
function padRight(string, length) {
  var currLength = chalk.stripColor(string).length;
  while (currLength < length) {
    currLength = currLength + 1;
    string = string + ' ';
  }
  return string;
}

// General Output Formatting

CliReporter.prototype.log = function log(maybeFormat) {
  var values = _.toArray(arguments);
  var format;
  if (_.isFunction(maybeFormat)) {
    values = values.slice(1);
    format = maybeFormat;
  }
  if (values[0] && values[0].browserName) {
    values[0] = padRight(this.prettyBrowser(values[0]), BROWSER_PAD);
  }

  var line = _.toArray(values).map(function(value) {
    return _.isString(value) ? value : util.inspect(value);
  }).join(' ');
  line = line.replace(/[\s\n\r]+$/, '');
  if (format) line = format(line);
  this.write(line);
};

CliReporter.prototype.writeWrapped = function writeWrapped(blocks, separator) {
  if (blocks.length === 0) return;

  var lines = [''];
  var width = this.stream.columns || 0;
  for (var i = 0, block; block = blocks[i]; i++) {
    var line     = lines[lines.length - 1];
    var combined = line + separator + block;
    if (line === '') {
      lines[lines.length - 1] = block;
    } else if (chalk.stripColor(combined).length <= width) {
      lines[lines.length - 1] = combined;
    } else {
      lines.push(block);
    }
  }

  this.writeLines(['\n'].concat(lines));
  if (this.options.ttyOutput) {
    this.stream.write('\r');
    this.stream.write('\033[' + (lines.length + 1) + 'A');
  }
};

CliReporter.prototype.write = function write(line) {
  this.writeLines([line]);
  this.updateStatus();
};

CliReporter.prototype.writeLines = function writeLines(lines) {
  for (var i = 0, line; line = lines[i]; i++) {
    if (line[line.length - 1] !== '\n') {
      line = line + '\n';
    }
    if (this.options.ttyOutput) {
      line = '\033[J' + line;
    }
    this.stream.write(line);
  }
  this.linesWritten = lines.length;
};

CliReporter.prototype.flush = function flush() {
  if (!this.options.ttyOutput) return;
  // Add an extra line for padding.
  for (var i = 0; i <= this.linesWritten; i++) {
    this.stream.write('\n');
  }
};

module.exports = CliReporter;
