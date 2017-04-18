/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _     = require('lodash');
var async = require('async');
var fs    = require('fs');
var glob  = require('glob');
var path  = require('path');

var INDEX      = 'index.html';
var VALID_FILE = /\.(js|html)$/;

/**
 * Expands a series of path patterns (globs, files, directories) into a set of
 * files that represent those patterns.
 *
 * @param {string} baseDir The directory that patterns are relative to.
 * @param {!Array<string>} patterns The patterns to expand.
 * @param {function(*, Array<string>)} done Callback given the expanded paths.
 */
function expand(baseDir, patterns, done) {
  async.waterfall([
    unglob.bind(null, baseDir, patterns),
    expandDirectories.bind(null, baseDir),
  ], done);
}

/**
 * Expands any glob expressions in `patterns`.
 *
 * @param {string} baseDir
 * @param {!Array<string>} patterns
 * @param {function(*, Array<string>)} done
 */
function unglob(baseDir, patterns, done) {
  async.map(patterns, function(pattern, next) {
    glob(String(pattern), {
      cwd:  baseDir,
      root: baseDir,
    }, next);
  }, function(error, results) {
    done(error, _.unique(_.flatten(results || [])));
  });
}

/**
 * Expands any directories in `patterns`, following logic similar to a web
 * server.
 *
 * If a pattern resolves to a directory, that directory is expanded. If the
 * directory contains an `index.html`, it is expanded to that. Otheriwse, the
 * it expands into its children (recursively).
 *
 * @param {string} baseDir
 * @param {!Array<string>} patterns
 * @param {function(*, Array<string>)} done
 */
function expandDirectories(baseDir, paths, done) {
  async.map(paths, function(aPath, next) {
    fs.stat(path.resolve(baseDir, aPath), function(error, stats) {
      if (error) return next(error);
      if (!stats.isDirectory()) return next(null, aPath);

      fs.readdir(path.resolve(baseDir, aPath), function(error, files) {
        if (error) return next(error);
        // We have an index; defer to that.
        if (_.include(files, INDEX)) {
          return next(null, path.join(aPath, INDEX));
        }
        // Otherwise, we've gotta recursively expand.
        expandDirectories(path.join(baseDir, aPath), files, function(error, children) {
          next(error, _.map(children || [], function(child) {
            return path.join(aPath, child);
          }));
        });
      });
    });
  }, function(error, results) {
    var files = _.unique(_.flatten(results || []));
    done(error, _.filter(files, VALID_FILE.test.bind(VALID_FILE)));
  });
}

module.exports = {
  expand: expand,
};
