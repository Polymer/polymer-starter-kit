/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */


'use strict';

import {Resolver, Deferred} from './resolver';

/**
 * A FileLoader lets you resolve URLs with a set of potential resolvers.
 */
export class FileLoader {
  resolvers: Resolver[] = [];

  // map url -> Deferred
  requests: {[url:string]: Deferred<string>} = {};

  /**
   * Add an instance of a Resolver class to the list of url resolvers
   *
   * Ordering of resolvers is most to least recently added
   * The first resolver to "accept" the url wins.
   * @param {Resolver} resolver The resolver to add.
   */
  addResolver(resolver:Resolver) {
    this.resolvers.push(resolver);
  };

  /**
   * Return a promise for an absolute url
   *
   * Url requests are deduplicated by the loader, returning the same Promise for
   * identical urls
   *
   * @param {string} url        The absolute url to request.
   * @return {Promise.<string>} A promise that resolves to the contents of the URL.
   */
  request(uri:string) {
    var promise: Promise<string>;

    if (!(uri in this.requests)) {
      var handled = false;
      var deferred = new Deferred<string>();
      this.requests[uri] = deferred;

      // loop backwards through resolvers until one "accepts" the request
      for (var i = this.resolvers.length - 1; i >= 0; i--) {
        const r = this.resolvers[i];
        if (r.accept(uri, deferred)) {
          handled = true;
          break;
        }
      }

      if (!handled) {
        deferred.reject(new Error('no resolver found for ' + uri));
      }

      promise = deferred.promise;
    } else {
      promise = this.requests[uri].promise;
    }

    return promise;
  }
};
