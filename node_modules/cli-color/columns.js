'use strict';

var from          = require('es5-ext/array/from')
  , iterable      = require('es5-ext/iterable/validate-object')
  , stringifiable = require('es5-ext/object/validate-stringifiable')
  , pad           = require('es5-ext/string/#/pad');

module.exports = function (rows/*, options*/) {
	var options = Object(arguments[1]), cols = [];
	return from(iterable(rows), function (row, index) {
		return from(iterable(row), function (str, index) {
			var col = cols[index];
			if (!col) col = cols[index] = { width: 0 };
			str = stringifiable(str);
			if (str.length > col.width) col.width = str.length;
			return str;
		});
	}).map(function (row) {
		return row.map(function (item, index) {
			return pad.call(item, ' ', -cols[index].width);
		}).join((options.sep == null) ? ' | ' : options.sep);
	}).join('\n') + '\n';
};
