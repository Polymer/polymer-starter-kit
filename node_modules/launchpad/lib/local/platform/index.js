var _ = require('underscore');
var debug = require('debug')('launchpad:local:platform');

var platforms = {
  win32 : './windows',
  darwin : './macos',
  linux : './unix',
  freebsd : './unix',
  sunos : './unix'
};

var platform = require(platforms[process.platform]);
var envBrowsers = process.env.LAUNCHPAD_BROWSERS;
var enabledBrowsers = envBrowsers ? envBrowsers.split(/\s*,\s*/) : Object.keys(platform);

debug('Local platform init. Enabled browsers:', enabledBrowsers.sort().join(', '));
module.exports = _.pick(platform, enabledBrowsers);
