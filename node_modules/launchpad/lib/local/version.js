var fs = require('fs');
var exec = require('child_process').exec;
var Q = require('q');
var path = require('path');
var plist = require('plist');
var utils = require('./utils');
var debug = require('debug')('launchpad:local:version');

module.exports = function(browser) {
  if (!browser || !browser.path) {
    return Q(null);
  }

  // Run ShowVer.exe and parse out ProductVersion key (Windows)
  if (process.platform === 'win32') {
    var command = path.join('"' + __dirname, '..', '..', 'resources', 'ShowVer.exe" "' + browser.command + '"');
    var deferred = Q.defer();

    debug('Retrieving version for windows executable', command);
    // Can't use Q.nfcall here unfortunately because of non 0 exit code
    exec(command, function(error, stdout) {
      var regex = /ProductVersion:\s*(.*)/;
      // ShowVer.exe returns a non zero status code even if it works
      if (typeof stdout === 'string' && regex.test(stdout)) {
        browser.version = stdout.match(regex)[1];
        debug('Found browser version', browser.name, browser.version);
      }

      return deferred.resolve(browser);
    });

    return deferred.promise;
  }

  // Read from plist information (MacOS)
  if(browser.plistPath) {
    try {
      var plistInfo = fs.readFileSync(path.join(browser.path, browser.plistPath)).toString();
      debug('Getting Browser information from pList', plistInfo);
      var data = plist.parse(plistInfo);
      browser.version = data[browser.versionKey];
      debug('Found browser version', browser.name, browser.version);
      return Q(browser);
    } catch (e) {
      return Q.reject(new Error('Unable to get ' + browser.name + ' version.'));
    }
  }

  // Try executing <browser> --version (everything else)
  return Q.nfcall(exec, browser.path + ' --version').then(function(stdout) {
    debug('Ran ' + browser.path + ' --version', stdout);
    var version = utils.getStdout(stdout);
    if (version) {
      browser.version = version;
    }
    return browser;
  }, function() {
    return browser;
  });
};
