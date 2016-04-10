// Strip ANSI formatting from string

'use strict';

var stringifiable = require('es5-ext/object/validate-stringifiable')
  , r             = require('ansi-regex')();

module.exports = function (str) { return stringifiable(str).replace(r, ''); };
