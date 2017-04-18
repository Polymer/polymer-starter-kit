var path = require('path');

module.exports = {
  chrome: {
    pathQuery: 'which google-chrome',
    process: 'chrome',
    opensTab: true,
    args: ['--no-first-run']
  },
  firefox: {
    pathQuery: 'which firefox',
    process: 'firefox',
    multi: true,
    // See https://developer.mozilla.org/en-US/docs/Mozilla/Command_Line_Options
    // Assuming Firefox >= 20
    args: ['--private-window']
  },
  opera: {
    pathQuery: 'which opera',
    process: 'opera'
  },
  phantom: {
    pathQuery: 'which phantomjs',
    process: 'phantomjs',
    args: [path.join(__dirname, '..', '..', '..', 'resources/phantom.js')],
    multi: true
  }
};
