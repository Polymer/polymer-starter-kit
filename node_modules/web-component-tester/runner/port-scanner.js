/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// jshint node: true
'use strict';

var net = require('net');
var async = require('async');

function checkPort(port, callback) {
  var server = net.createServer();
  var hasPort = false;

  // if server is listening, we have the port!
  server.on('listening', function(err) {
    hasPort = true;
    server.close();
  });

  // callback on server close to free up the port before report it can be used
  server.on('close', function(err) {
    callback(hasPort);
  });

  // our port is busy, ignore it
  server.on('error', function(err) {
    // docs say the server should close, this doesn't seem to be the case :(
    server.close();
  });

  server.listen(port);
}

module.exports = function findPort(ports, callback) {
  // check the ports in series so that checkPort does not stomp on itself
  async.detectSeries(ports, checkPort, function(port) {
    if (!port) {
      callback(new Error('no port found!'));
    } else {
      callback(null, port);
    }
  });
};
