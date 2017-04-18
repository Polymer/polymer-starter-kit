/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * Mapping sets for common serving patterns.
 */
module.exports = {

  /**
   * Your basic static server. Serves all files from `<root>`.
   */
  STATIC: [
    {'/': '.'},
  ],

  /**
   * A web component and its dependencies.
   *
   * The component (`<root>`) is served under `/components/<basename>`. Its
   * dependencies are also served under `/components`, giving priority to
   * sandboxed dependencies located under `bower_components`. Otherwise,
   * dependencies located in sibling directories are loaded.
   */
  WEB_COMPONENT: [
    {'/components/<basename>': '.'},
    {'/components': 'bower_components'},
    {'/components': '..'},
    {'/': '.'},
  ],

};
