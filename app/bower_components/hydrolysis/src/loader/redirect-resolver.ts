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

import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import {FSResolver, Config as FSConfig} from './fs-resolver';
import {Deferred} from './resolver';

interface RedirectConfig {
  protocol: string;
  hostname: string;
  path: string;
  redirectPath: string;
}

/**
 * A single redirect configuration
 * @param {Object} config              The configuration object
 * @param {string} config.protocol     The protocol this redirect matches.
 * @param {string} config.hostname     The host name this redirect matches.
 * @param {string} config.path         The part of the path to match and
 *                                     replace with 'redirectPath'
 * @param {string} config.redirectPath The local filesystem path that should
 *                                     replace "protocol://hosname/path/"
 */
class ProtocolRedirect {
  /**
   * The protocol this redirect matches.
   */
  protocol: string;
  /**
   * The host name this redirect matches.
   */
  hostname: string;
  /**
   * The part of the path to match and replace with 'redirectPath'
   */
  path: string;
  /**
   * The local filesystem path that should replace "protocol://hosname/path/"
   */
  redirectPath: string;
  constructor(config:RedirectConfig) {
    this.protocol = config.protocol;
    this.hostname = config.hostname;
    this.path = config.path;
    this.redirectPath = config.redirectPath;
  }

  redirect(uri: string) {
    var parsed = url.parse(uri);
    if (this.protocol !== parsed.protocol) {
      return null;
    } else if (this.hostname !== parsed.hostname) {
      return null;
    } else if (parsed.pathname.indexOf(this.path) !== 0) {
      return null;
    }
    return path.join(this.redirectPath,
      parsed.pathname.slice(this.path.length));
  }
};

interface RedirectConfig extends FSConfig {
  redirects: ProtocolRedirect[];
}

/**
 * Resolves protocol://hostname/path to the local filesystem.
 * @constructor
 * @memberof hydrolysis
 * @param {Object} config  configuration options.
 * @param {string} config.root Filesystem root to search. Defaults to the
 *     current working directory.
 * @param {Array.<ProtocolRedirect>} redirects A list of protocol redirects
 *     for the resolver. They are checked for matching first-to-last.
 */
export class RedirectResolver extends FSResolver {
  redirects: ProtocolRedirect[];
  constructor(config:RedirectConfig) {
    super(config);
    this.redirects = config.redirects || [];
  }
  accept(uri: string, deferred: Deferred<string>) {
    for (var i = 0; i < this.redirects.length; i++) {
      var redirected = this.redirects[i].redirect(uri);
      if (redirected) {
        return FSResolver.prototype.accept.call(this, redirected, deferred);
      }
    }
    return false;
  };

  static ProtocolRedirect = ProtocolRedirect;
}
