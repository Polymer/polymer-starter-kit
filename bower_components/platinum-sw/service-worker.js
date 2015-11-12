/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {
  var VERSION = '1.0';
  
  function deserializeUrlParams(queryString) {
    return new Map(queryString.split('&').map(function(keyValuePair) {
      var splits = keyValuePair.split('=');
      var key = decodeURIComponent(splits[0]);
      var value = decodeURIComponent(splits[1]);
      if (value.indexOf(',') >= 0) {
        value = value.split(',');
      }
  
      return [key, value];
    }));
  }
  
  global.params = deserializeUrlParams(location.search.substring(1));
  
  if (global.params.get('version') !== VERSION) {
    throw 'The registered script is version ' + VERSION +
          ' and cannot be used with <platinum-sw-register> version ' + global.params.get('version');
  }
  
  if (global.params.has('importscript')) {
    var scripts = global.params.get('importscript');
    if (Array.isArray(scripts)) {
      importScripts.apply(null, scripts);
    } else {
      importScripts(scripts);
    }
  }
  
  if (global.params.get('skipWaiting') === 'true' && global.skipWaiting) {
    global.addEventListener('install', function(e) {
      e.waitUntil(global.skipWaiting());
    });
  }
  
  if (global.params.get('clientsClaim') === 'true' && global.clients && global.clients.claim) {
    global.addEventListener('activate', function(e) {
      e.waitUntil(global.clients.claim());
    });
  }
})(self);
