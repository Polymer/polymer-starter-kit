/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var swToolboxURL = new URL('../sw-toolbox/sw-toolbox.js', params.get('baseURI')).href;
importScripts(swToolboxURL);

if (params.has('defaultCacheStrategy')) {
  var strategy = params.get('defaultCacheStrategy');
  toolbox.router.default = toolbox[strategy] || self[strategy];
}

if (params.has('precache')) {
  toolbox.precache(params.get('precache'));
}

if (params.has('route')) {
  var setsOfRouteParams = params.get('route');
  while (setsOfRouteParams.length > 0) {
    var routeParams = setsOfRouteParams.splice(0, 3);
    var originParam;
    if (routeParams[2]) {
      originParam = {origin: new RegExp(routeParams[2])};
    }
    var handler = toolbox[routeParams[1]] || self[routeParams[1]];
    if (typeof handler === 'function') {
      toolbox.router.get(routeParams[0], handler, originParam);
    } else {
      console.error('Unable to register sw-toolbox route: ', routeParams);
    }
  }
}
