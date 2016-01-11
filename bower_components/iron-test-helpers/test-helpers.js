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
  'use strict';

  global.flushAsynchronousOperations = function() {
    // force distribution
    Polymer.dom.flush();
    // force lifecycle callback to fire on polyfill
    window.CustomElements && window.CustomElements.takeRecords();
  };

  global.forceXIfStamp = function(node) {
    var templates = Polymer.dom(node.root).querySelectorAll('template[is=dom-if]');
    for (var tmpl, i = 0; tmpl = templates[i]; i++) {
      tmpl.render();
    }

    global.flushAsynchronousOperations();
  };

  global.fireEvent = function(type, props, node) {
    var event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true
    });
    for (var p in props) {
      event[p] = props[p];
    }
    node.dispatchEvent(event);
  };

  global.skipUnless = function(condition, test) {
    var isAsyncTest = !!test.length;

    return function(done) {
      var testCalledDone = false;

      if (!condition()) {
        return done();
      }

      var result = test.call(this, done);

      if (!isAsyncTest) {
        done();
      }

      return result;
    };
  };
})(this);
