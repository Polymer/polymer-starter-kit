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

var chalk  = require('chalk');
var expect = require('chai').expect;

var formatting = require('../lib/formatting');
var parse      = require('../lib/parsing').parse;

describe('formatting', function() {

  describe('.pretty', function() {
    var pretty = formatting.pretty;

    beforeEach(function() {
      chalk.enabled = false;
    });

    it('lines up methods', function() {
      expect(pretty(
        'short@bar.js:1:2\n' +
        'pretty damn long@bar.js:3:4\n' +
        'sorta long@bar.js:5:6'
      )).to.deep.eq(
        '           short at bar.js:1:2\n' +
        'pretty damn long at bar.js:3:4\n' +
        '      sorta long at bar.js:5:6'
      );
    });

    it('honors maxMethodPadding', function() {
      expect(pretty(
        'short@bar.js:1:2\n' +
        'pretty damn long@bar.js:3:4\n' +
        'sorta long@bar.js:5:6',
      {maxMethodPadding: 10})).to.deep.eq(
        '     short at bar.js:1:2\n' +
        'pretty damn long at bar.js:3:4\n' +
        'sorta long at bar.js:5:6'
      );
    });

    it('honors chalk.enabled', function() {
      chalk.enabled = true;
      expect(pretty(
        'short@bar.js:1:2\n' +
        'pretty damn long@baz.js:3:4\n' +
        'sorta long@bar.js:5:6',
      {unimportantLocation: ['baz.js']})).to.deep.eq(
        /* jshint ignore:start */
        '           \u001b[35mshort\u001b[39m at \u001b[34mbar.js\u001b[39m:\u001b[36m1\u001b[39m:\u001b[36m2\u001b[39m\n' +
        '\u001b[2m\u001b[35mpretty damn long\u001b[39m at \u001b[34mbaz.js\u001b[39m:\u001b[36m3\u001b[39m:\u001b[36m4\u001b[39m\u001b[22m\n' +
        '      \u001b[35msorta long\u001b[39m at \u001b[34mbar.js\u001b[39m:\u001b[36m5\u001b[39m:\u001b[36m6\u001b[39m'
        /* jshint ignore:end */
      );
    });

    it('replaces missing methods', function() {
      expect(pretty(
        '@bar.js:1:2\n' +
        'thing@bar.js:3:4\n',
      {maxMethodPadding: 10})).to.deep.eq(
        '<unknown> at bar.js:1:2\n' +
        '    thing at bar.js:3:4'
      );
    });

  });

  describe('.clean', function() {
    var clean = formatting.clean;

    var options = {
      locationStrip: [/^bar\//, 'two/'],
      unimportantLocation: [/^thing/],
      filter: function() { return false; },
    };

    function cleaned(stack, key) {
      return clean(parse(stack), options).map(function (line) { return line[key]; });
    }

    it('honors locationStrip', function() {
      var locations = cleaned('foo@bar/baz.js:1:2\nzero@one/two/three.js:4:5', 'location');
      expect(locations).to.deep.eq(['baz.js', 'one/three.js']);
    });

    it('avoids mangling locations that do not match locationStrip', function() {
      var locations = cleaned('foo@fizz/buzz.js:1:2\nzero@three.js:4:5', 'location');
      expect(locations).to.deep.eq(['fizz/buzz.js', 'three.js']);
    });

    it('marks unimportant lines as such', function() {
      var flags = cleaned('foo@bar/baz.js:1:2\n@thing/stuff.js:4:5', 'important');
      expect(flags).to.deep.eq([true, false]);
    });

  });

});
