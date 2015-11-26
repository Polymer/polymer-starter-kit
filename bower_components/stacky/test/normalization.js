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

var normalization = require('../lib/normalization');

var FULL_ERROR = {
  message: 'ReferenceError: FAIL is not defined',
  stack: 'ReferenceError: FAIL is not defined\n' +
         '   at Constraint.execute (deltablue.js:525:2)\n' +
         '   at Constraint.recalculate (deltablue.js:424:21)',
};

describe('normalization', function() {

  describe('.normalize', function() {
    var normalize = normalization.normalize;

    it('hides columns by default', function() {
      var err = normalize(FULL_ERROR);
      err.stack = chalk.stripColor(err.stack);
      expect(err).to.deep.equal({
        message: 'ReferenceError: FAIL is not defined',
        stack: 'ReferenceError: FAIL is not defined\n' +
               '    Constraint.execute at deltablue.js:525\n' +
               'Constraint.recalculate at deltablue.js:424',
        parsedStack: [
          {
            location:  'deltablue.js',
            method:    'Constraint.execute',
            line:      525,
            important: true,
          },
          {
            location:  'deltablue.js',
            method:    'Constraint.recalculate',
            line:      424,
            important: true,
          },
        ],
      });
    });

    it('supports modern errors', function() {
      var err = normalize(FULL_ERROR, {showColumns: true});
      err.stack = chalk.stripColor(err.stack);
      expect(err).to.deep.equal({
        message: 'ReferenceError: FAIL is not defined',
        stack: 'ReferenceError: FAIL is not defined\n' +
               '    Constraint.execute at deltablue.js:525:2\n' +
               'Constraint.recalculate at deltablue.js:424:21',
        parsedStack: [
          {
            location:  'deltablue.js',
            method:    'Constraint.execute',
            column:    2,
            line:      525,
            important: true,
          },
          {
            location:  'deltablue.js',
            method:    'Constraint.recalculate',
            column:    21,
            line:      424,
            important: true,
          },
        ],
      });
    });

    it('handles stackless errors', function() {
      var error = {
        description:  'Something brokeded',
        fileName:     'some/file.js',
        lineNumber:   123,
        columnNumber: 27,
      };

      var err = normalize(error, {showColumns: true});
      err.stack = chalk.stripColor(err.stack);

      expect(err).to.deep.equal({
        message: 'Something brokeded',
        stack: 'Something brokeded\n' +
               '<unknown> at some/file.js:123:27',
        parsedStack: [{
          location:  'some/file.js',
          method:    '',
          column:    27,
          line:      123,
          important: true,
        }],
      });
    });

    it('handles string-only errors', function() {
      expect(normalize('Uncaught Error: stuff')).to.deep.equal({
        message: 'Uncaught Error: stuff',
        stack: 'Uncaught Error: stuff',
        parsedStack: [],
      });
    });

  });

});
