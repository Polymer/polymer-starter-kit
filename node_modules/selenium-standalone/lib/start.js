module.exports = start;

var merge = require('lodash').merge;
var spawn = require('child_process').spawn;

var which = require('which');
var merge = require('lodash').merge;
var mapValues = require('lodash').mapValues;

var checkPathsExistence = require('./check-paths-existence');
var checkStarted = require('./check-started');
var computeFsPaths = require('./compute-fs-paths');
var defaultConfig = require('./default-config');
var noop = require('./noop');

function start(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  if (!opts.seleniumArgs) {
    opts.seleniumArgs = [];
  }

  if (!opts.version) {
    opts.version = defaultConfig.version;
  }

  if (!opts.spawnCb) {
    opts.spawnCb = noop;
  }

  if (opts.drivers) {
    // Merge in missing driver options for those specified
    opts.drivers = mapValues(opts.drivers, function(config, name) {
      return merge({}, defaultConfig.drivers[name], config);
    });
  } else {
    opts.drivers = defaultConfig.drivers;
  }

  var fsPaths = computeFsPaths({
    seleniumVersion: opts.version,
    drivers: opts.drivers,
    basePath: opts.basePath
  });

  if (typeof cb !== 'function') {
    throw new Error('You must provide a callback when starting selenium');
  }

  // programmatic use, did not give javaPath
  if (!opts.javaPath) {
    opts.javaPath = which.sync('java');
  }

  var args = [
    '-jar',
    fsPaths.selenium.installPath
  ];

  if (fsPaths.chrome) {
    args.push('-Dwebdriver.chrome.driver=' + fsPaths.chrome.installPath);
  }

  if (process.platform === 'win32' && fsPaths.ie) {
    args.push('-Dwebdriver.ie.driver=' + fsPaths.ie.installPath);
  } else {
    delete fsPaths.ie;
  }

  args = args.concat(opts.seleniumArgs);

  checkPathsExistence(getInstallPaths(fsPaths), function(err) {
    if (err) {
      cb(err);
      return;
    }

    var neverStarted = false;
    var selenium = spawn(opts.javaPath, args, opts.spawnOptions);

    opts.spawnCb(selenium);

    selenium.on('exit', errorIfNeverStarted);

    checkStarted(args, function started(err) {
      process.nextTick(function() {
        // Add empty handler to stdout and stderr so the buffers can be flushed
        // otherwise the process would eat up memory for nothing and crash
        // we add it here so that users can register their own listeners
        if (selenium.stdout && selenium.stderr) {
          if (selenium.stdout.listeners('data').length === 0) {
            selenium.stdout.on('data', noop);
          }
          if (selenium.stderr.listeners('data').length === 0) {
            selenium.stderr.on('data', noop);
          }
        }
      });

      selenium.removeListener('exit', errorIfNeverStarted);

      if (err) {
        cb(err);
        return;
      }

      if (!neverStarted) {
        cb(null, selenium);
      } // else ignore, callback has already been called in errorIfNeverStarted()
    });

    function errorIfNeverStarted(code) {
      var err;

      neverStarted = true;

      if (code === 1) {
        err = new Error('Another Selenium process is already running')
      } else {
        err = new Error('Selenium exited before it could start')
      }

      cb(err);
    }
  });
}

function getInstallPaths(fsPaths) {
  return Object.keys(fsPaths).map(function(name) {
    return fsPaths[name].installPath;
  });
}
