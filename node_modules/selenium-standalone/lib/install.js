module.exports = install;

var async = require('async');
var crypto = require('crypto');
var fs = require('fs');
var merge = require('lodash').merge;
var mapValues = require('lodash').mapValues;
var mkdirp = require('mkdirp');
var path = require('path');
var request = require('request');

var computeDownloadUrls = require('./compute-download-urls');
var computeFsPaths = require('./compute-fs-paths');
var defaultConfig = require('./default-config');
var noop = require('./noop');

function install(opts, cb) {
  var total = 0;
  var progress = 0;
  var startedRequests = 0;
  var expectedRequests = 3;

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var logger = opts.logger || noop;

  if (!opts.baseURL) {
    opts.baseURL = defaultConfig.baseURL;
  }

  if (!opts.version) {
    opts.version = defaultConfig.version;
  }

  if (opts.drivers) {
    // Merge in missing driver options for those specified
    opts.drivers = mapValues(opts.drivers, function(config, name) {
      return merge({}, defaultConfig.drivers[name], config);
    });
  } else {
    opts.drivers = defaultConfig.drivers;
  }

  opts.progressCb = opts.progressCb || noop;

  logger('----------');
  logger('selenium-standalone installation starting');
  logger('----------');
  logger('');

  var fsPaths = computeFsPaths({
    seleniumVersion: opts.version,
    drivers: opts.drivers,
    basePath: opts.basePath
  });

  var urls = computeDownloadUrls({
    seleniumVersion: opts.version,
    seleniumBaseURL: opts.baseURL,
    drivers: opts.drivers
  });

  if (process.platform !== 'win32') {
    delete fsPaths.ie;
    delete urls.ie;
    expectedRequests -= 1;
  }

  logInstallSummary(logger, fsPaths, urls);

  var tasks = [
    createDirs.bind(null, fsPaths),
    download.bind(null, {
      urls: urls,
      fsPaths: fsPaths
    }),
    asyncLogEnd.bind(null, logger)
  ];

  if (fsPaths.chrome) {
    tasks.push(chmodChromeDr.bind(null, fsPaths.chrome.installPath));
  }

  async.series(tasks, function(err) {
    cb(err, fsPaths);
  });

  function onlyInstallMissingFiles(opts, cb) {
    async.series([
      checksum.bind(null, opts.to),
      etag.bind(null, opts.from)
    ], function (error, results) {
      if (error) {
        return cb(error);
      }

      // File already exists. Prevent download/installation.
      if (results[0] === results[1]) {
        logger('---');
        logger('File from ' + opts.from + ' has already been downloaded');
        expectedRequests -= 1;
        return cb();
      }

      opts.installer.call(null, {
        to: opts.to,
        from: opts.from
      }, cb);
    });
  }

  function download(opts, cb) {
    var installers = [{
      installer: installSelenium,
      from: opts.urls.selenium,
      to: opts.fsPaths.selenium.downloadPath
    }];

    if (opts.fsPaths.chrome) {
      installers.push({
        installer: installChromeDr,
        from: opts.urls.chrome,
        to: opts.fsPaths.chrome.downloadPath
      });
    }

    if (process.platform === 'win32' && opts.fsPaths.ie) {
      installers.push({
        installer: installIeDr,
        from: opts.urls.ie,
        to: opts.fsPaths.ie.downloadPath
      });
    }

    var steps = installers.map(function (opts) {
      return onlyInstallMissingFiles.bind(null, opts);
    });

    async.parallel(steps, cb);
  }

  function installSelenium(opts, cb) {
    getDownloadStream(opts.from, function(err, stream) {
      if (err) {
        return cb(err);
      }

      stream
        .pipe(fs.createWriteStream(opts.to))
        .once('error', cb.bind(null, new Error('Could not write to ' + opts.to)))
        .once('finish', cb);
    });
  }

  function installChromeDr(opts, cb) {
    installZippedFile(opts.from, opts.to, cb);
  }

  function installIeDr(opts, cb) {
    installZippedFile(opts.from, opts.to, cb);
  }

  function installZippedFile(from, to, cb) {
    var unzip = require('unzip');

    getDownloadStream(from, function(err, stream) {
      if (err) {
        return cb(err);
      }

      var extractPath = path.join(path.dirname(to), path.basename(to, '.zip'));

      // Store downloaded compressed file
      stream.pipe(fs.createWriteStream(to));

      // Uncompress downloaded file
      stream.pipe(unzip.Parse())
        .once('entry', function(file) {
          file
            .pipe(fs.createWriteStream(extractPath))
            .once('error', cb.bind(null, new Error('Could not write to ' + to)))
            .once('finish', cb);
        })
        .once('error', cb.bind(null, new Error('Could not unzip ' + from)));
    });
  }

  function getDownloadStream(downloadUrl, cb) {
    var r = request(downloadUrl)
      .on('response', function(res) {
        startedRequests += 1;

        if (res.statusCode !== 200) {
          return cb(new Error('Could not download ' + downloadUrl));
        }

        res.on('data', function(chunk) {
          progress += chunk.length;
          updateProgressPercentage(chunk.length);
        });

        total += parseInt(res.headers['content-length'], 10);

        cb(null, res);
      })
      .once('error', function(error) {
        cb(new Error('Could not download ' + downloadUrl + ': ' + error));
      });

    // initiate request
    r.end();
  }

  function updateProgressPercentage(chunk) {
    if (expectedRequests === startedRequests) {
      opts.progressCb(total, progress, chunk);
    }
  }
}

function asyncLogEnd(logger, cb) {
  setImmediate(function() {
    logger('');
    logger('');
    logger('-----');
    logger('selenium-standalone installation finished');
    logger('-----');
    cb();
  });
}

function createDirs(paths, cb) {
  var installDirectories =
    Object
      .keys(paths)
      .map(function(name) {
        return paths[name].installPath;
      });

  async.eachSeries(
    installDirectories.map(basePath),
    mkdirp,
    cb
  );
}

function basePath(fullPath) {
  return path.dirname(fullPath);
}

function chmodChromeDr(where, cb) {
  var chmod = function () {
    fs.chmod(where, '0755', cb);
  };

  // node.js 0.10.x does not support fs.access
  if (fs.access) {
    fs.access(where, fs.R_OK | fs.X_OK, function(err) {
      if (err) {
        chmod();
      } else {
        return cb();
      }
    }.bind(this));
  } else {
    chmod();
  }
}

function logInstallSummary(logger, paths, urls) {
  ['selenium', 'chrome', 'ie'].forEach(function log(name) {
    if (!paths[name]) {
      return;
    }

    logger('---');
    logger(name + ' install:');
    logger('from: ' + urls[name]);
    logger('to: ' + paths[name].installPath);
  });
}

function checksum (filepath, cb) {
  if (!fs.existsSync(filepath)) {
    return cb();
  }

  var hash = crypto.createHash('md5');
  var stream = fs.createReadStream(filepath);

  stream.on('data', function (data) {
    hash.update(data, 'utf8');
  }).on('end', function () {
    cb(null, hash.digest('hex'));
  }).once('error', cb);
}

function unquote (str, quoteChar) {
  quoteChar = quoteChar || '"';

  if (str[0] === quoteChar && str[str.length - 1] === quoteChar) {
    return str.slice(1, str.length - 1);
  }

  return str;
}

function etag (url, cb) {
  request.head(url).on('response', function (res) {

    if (res.statusCode !== 200) {
      return cb(new Error('Could not request headers from ' + url + ': ', res.statusCodestatusCode));
    }

    cb(null, unquote(res.headers.etag));
  }).once('error', function (err) {
    cb(new Error('Could not request headers from ' + url + ': ' + err));
  });
}
