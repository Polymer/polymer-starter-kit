/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 *
 * This code may only be used under the BSD style license found at polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also subject to
 * an additional IP rights grant found at polymer.github.io/PATENTS.txt
 */
'use strict';

var expect = require('chai').expect;

var stacky = require('../lib');

describe('stacky', function() {
  it('exposes .parse', function() {
    expect(stacky.parse).to.be.a('function');
  });

  it('exposes .pretty', function() {
    expect(stacky.pretty).to.be.a('function');
  });
});
