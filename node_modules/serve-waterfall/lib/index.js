/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var http     = require('http');
var parseurl = require('parseurl');
var path     = require('path');
var send     = require('send');

/**
 * @typedef {Object} Options
 * @property {string} root The directory to resolve files paths relative to.
 * @property {Object<string, string>} headers Headers to send with each request.
 * @property {Object} sendOpts Raw options for the `send` module.
 * @property {function(string)} log A function to call with verbose debugging
 *     messages.
 */

/**
 * @typedef {Array<Object<string, string>>} Mappings
 */

/**
 * Provides a widdleware that serves static files according to a waterfall of
 * URL to file mappings.
 *
 * Mappings are expressed as a priority list of URL prefixes to on disk paths.
 * For example:
 *
 *    [{'/foo/bar/': 'bar/'}, {'/': '.'}]
 *
 * Any URLs that begin with `/foo/bar/` would map to `<root>/bar/`, and anything
 * else would just map normally.
 *
 * Mappings can make use of the special `<basename>` string, which will be
 * replaced with the basename of `options.root`.
 *
 * @param {Mappings} mappings The mappings to serve.
 * @param {Options=} options Additional options for the middleware.
 * @return {Function} The built middleware.
 */
function serveWaterfall(mappings, options) {
  options = options || {};
  var waterfall = _buildWaterfall(mappings, path.resolve(options.root || '.'));
  _logWaterfall(options.log, waterfall);

  return function serveWaterfallMiddleware(request, response, next) {
    // Emit a generic 404 if we are not wired to any other middleware.
    if (!next) {
      next = _emitError.bind(null, response, 404);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return next();
    // Kick off the waterfall.
    //
    // `_tryStep` calls us back each time it finds a prefix match.
    _tryStep(waterfall, 0, request, response, next, options.log, function(remainder, target) {
      var sendOptions = Object.create(options.sendOpts || null);
      sendOptions.root = target;
      return send(request, remainder, sendOptions)
          .on('headers', _setHeaders.bind(null, response, options.headers));
    });
  };
}


// Exports


module.exports = serveWaterfall;
/** @enum {Mapping} */
module.exports.mappings = require('./mappings');


// Private Implementation


/**
 * @param {Mappings} mappings The mappings to serve.
 * @param {string} root The root directory paths are relative to.
 * @return {Array<{prefix: string, target: string}>}
 */
function _buildWaterfall(mappings, root) {
  var basename = path.basename(root);

  var waterfall = [];
  for (var i = 0; i < mappings.length; i++) {
    Object.keys(mappings[i]).forEach(function(prefix) {
      waterfall.push({
        prefix: prefix.replace('<basename>', basename),
        target: path.resolve(root, mappings[i][prefix]),
      });
    });
  }

  return waterfall;
}

/**
 * @param {function(string)?} log
 * @param {Array<{prefix: string, target: string}>} waterfall
 */
function _logWaterfall(log, waterfall) {
  if (!log) return;
  log('Expanded serve-waterfall configuration:');
  waterfall.forEach(function(step) {
    log('  ' + step.prefix + ' -> ' + step.target);
  });
}


/**
 * Executes a single step of a waterfall.
 *
 * @param {Array<{prefix: string, target: string}>} waterfall
 * @param {number} index
 * @param {Request) request
 * @param {Response) response
 * @param {Function} next
 * @param {function(string)?} log
 * @param {function(string, string): Stream} doSend
 */
function _tryStep(waterfall, index, request, response, next, log, doSend) {
  var step = waterfall[index];
  // No more steps in the waterfall? Continue to the next middleware.
  if (!step) return next();
  var requestPath = parseurl(request).pathname;
  // Not a match? Try the next step.
  if (requestPath.indexOf(step.prefix) !== 0) {
    return _tryStep(waterfall, index + 1, request, response, next, log, doSend);
  }
  // We have a match!
  var remainder = requestPath.substr(step.prefix.length);
  doSend(remainder, step.target)
      .on('error', function(error) {
        if (log) log('Tried ' + error.path + ' (' + error.status + ')');
        // We only continue with the waterfall if the error is 4xx.
        if (!error.status || error.status < 400 || error.status >= 500) return next();
        _tryStep(waterfall, index + 1, request, response, next, log, doSend);
      })
      .on('file', function(path, stat) {
        if (log) log('Serving ' + path);
        // console.log('file', arguments);
      })
      .pipe(response);
}


/**
 * @param {Response} response
 * @param {Object?} headers
 */
function _setHeaders(response, headers) {
  if (!headers) return;
  Object.keys(headers).forEach(function(key) {
    response.setHeader(key, headers[key]);
  });
}


/**
 * @param {Response} response
 * @param {number} code
 */
function _emitError(response, code) {
  response.statusCode = code;
  response._headers   = undefined;
  response.end(http.STATUS_CODES[code]);
}
