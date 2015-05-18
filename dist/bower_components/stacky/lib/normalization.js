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
(function(scope) {
'use strict';

var parse  = scope.parse  || require('./parsing').parse;
var pretty = scope.pretty || require('./formatting').pretty;

function normalize(error, prettyOptions) {
  if (error.parsedStack) return error;
  var message = error.message || error.description || error || '<unknown error>';
  var parsedStack = [];
  try {
    parsedStack = parse(error.stack || error.toString());
  } catch (error) {
    // Ah well.
  }

  if (parsedStack.length === 0 && error.fileName) {
    parsedStack.push({
      method:   '',
      location: error.fileName,
      line:     error.lineNumber,
      column:   error.columnNumber,
    });
  }

  if (!prettyOptions || !prettyOptions.showColumns) {
    for (var i = 0, line; line = parsedStack[i]; i++) {
      delete line.column;
    }
  }

  var prettyStack = message;
  if (parsedStack.length > 0) {
    prettyStack = prettyStack + '\n' + pretty(parsedStack, prettyOptions);
  }

  return {
    message:     message,
    stack:       prettyStack,
    parsedStack: parsedStack,
  };
}

scope.normalize = normalize;
})(typeof module !== 'undefined' ? module.exports : (this.Stacky = this.Stacky || {}));

