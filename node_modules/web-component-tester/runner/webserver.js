/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _              = require('lodash');
var chalk          = require('chalk');
var cleankill      = require('cleankill');
var express        = require('express');
var fs             = require('fs');
var http           = require('http');
var httpbin        = require('./httpbin');
var path           = require('path');
var portscanner    = require('./port-scanner');
var send           = require('send');
var serveWaterfall = require('serve-waterfall');
var serverDestroy  = require('server-destroy');

// Template for generated indexes.
var INDEX_TEMPLATE = _.template(fs.readFileSync(
  path.resolve(__dirname, '../data/index.html'), {encoding: 'utf-8'}
));

// We prefer serving local assets over bower assets.
var PACKAGE_ROOT = path.resolve(__dirname, '..');
var SERVE_STATIC = {  // Keys are regexps.
  '^(.*/web-component-tester|)/browser\\.js$':         path.join(PACKAGE_ROOT, 'browser.js'),
  '^(.*/web-component-tester|)/browser\\.js\\.map$':   path.join(PACKAGE_ROOT, 'browser.js.map'),
  '^(.*/web-component-tester|)/data/a11ySuite\\.js$':  path.join(PACKAGE_ROOT, 'data', 'a11ySuite.js'),
};

var DEFAULT_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma':        'no-cache',
  'Expires':        0,
};

// Sauce Labs compatible ports
// taken from https://docs.saucelabs.com/reference/sauce-connect/#can-i-access-applications-on-localhost-
// - 80, 443, 888: these ports must have root access
// - 5555, 8080: not forwarded on Android
var SAUCE_PORTS = [
2000, 2001, 2020, 2109, 2222, 2310, 3000, 3001, 3030, 3210, 3333, 4000, 4001,
4040, 4321, 4502, 4503, 4567, 5000, 5001, 5050, 5432, 6000, 6001, 6060, 6666,
6543, 7000, 7070, 7774, 7777, 8000, 8001, 8003, 8031, 8081, 8765, 8777, 8888,
9000, 9001, 9080, 9090, 9876, 9877, 9999, 49221, 55001
];

/**
 * The webserver module is a quasi-plugin. This ensures that it is hooked in a
 * sane way (for other plugins), and just follows the same flow.
 *
 * It provides a static HTTP server for serving the desired tests and WCT's
 * `browser.js`/`environment.js`.
 */
module.exports = function(wct) {
  var options = wct.options;

  wct.hook('configure', function(done) {
    // For now, you should treat all these options as an implementation detail
    // of WCT. They may be opened up for public configuration, but we need to
    // spend some time rationalizing interactions with external webservers.
    options.webserver = _.merge(options.webserver, {
      // The URL path that each test run should target.
      webRunnerPath: undefined,
      // If present, HTML content that should be served at `webRunner`.
      webRunnerContent: undefined,
      // Map of route expressions (regular expressions) to local file paths that
      // should be served by the webserver.
      staticContent: SERVE_STATIC,
    });

    if (options.verbose) options.clientOptions.verbose = true;

    // Prefix our web runner URL with the base path.
    var urlPrefix = options.webserver.urlPrefix;
    urlPrefix = urlPrefix.replace('<basename>', path.basename(options.root));
    options.webserver.webRunnerPath    = urlPrefix + '/generated-index.html';

    // Hacky workaround for Firefox + Windows issue where FF screws up pathing.
    // Bug: https://github.com/Polymer/web-component-tester/issues/194

    options.suites = options.suites.map(function (cv) {
      return cv.replace(/\\/g,'/');
    });

    options.webserver.webRunnerContent = INDEX_TEMPLATE(options);

    done();
  });

  wct.hook('prepare', function(done) {
    var wsOptions = options.webserver;

    getPort(function(error, port) {
      if (error) return done(error);
      // `port` (and `webRunnerPath`) is read down the line by `BrowserRunner`.
      wsOptions.port = port;

      var app    = express();
      var server = http.createServer(app);
      // `runTests` needs a reference to this (for the socket.io endpoint).
      wct._httpServer = server;

      // Debugging information for each request.
      app.use(function(request, response, next) {
        var msg = request.url + ' (' + request.header('referer') + ')';
        wct.emit('log:debug', chalk.magenta(request.method), msg);
        next();
      });

      // Mapped static content (overriding files served at the root).
      _.each(wsOptions.staticContent, function(file, url) {
        app.get(new RegExp(url), function(request, response) {
          response.set(DEFAULT_HEADERS);
          send(request, file).pipe(response);
        });
      });

      // The generated web runner, if present.
      if (wsOptions.webRunnerContent) {
        app.get(wsOptions.webRunnerPath, function(request, response) {
          response.set(DEFAULT_HEADERS);
          response.send(wsOptions.webRunnerContent);
        });
      }

      // At this point, we allow other plugins to hook and configure the
      // webserver as they please.
      wct.emitHook('prepare:webserver', app, function(error) {
        if (error) return done(error);

        // Serve up all the static assets.
        app.use(serveWaterfall(wsOptions.pathMappings, {
          root:    options.root,
          headers: DEFAULT_HEADERS,
          log:     wct.emit.bind(wct, 'log:debug'),
        }));

        app.use('/httpbin', httpbin.httpbin);

        app.get('/favicon.ico', function(request, response) {
          response.end();
        });

        app.use(function(request, response, next) {
          wct.emit('log:warn', '404', chalk.magenta(request.method), request.url);
          next();
        });

        server.listen(port);
        server.port = port;
        serverDestroy(server);

        cleankill.onInterrupt(function(done) {
          // close the socket IO server directly if it is spun up
          var io = wct._socketIOServer;
          if (io) {
            // we will close the underlying server ourselves
            io.httpServer = null;
            io.close();
          }
          server.destroy();
          server.on('close', done);
        });

        wct.emit('log:info',
          'Web server running on port', chalk.yellow(port),
          'and serving from', chalk.magenta(options.root)
        );
        done();
      });
    });
  });

  function getPort(done) {
    if (options.webserver.port) {
      done(null, options.webserver.port);
    } else {
      portscanner(SAUCE_PORTS, done);
    }
  }

};
