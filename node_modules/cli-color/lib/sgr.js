'use strict';
/* CSI - control sequence introducer */
/* SGR - set graphic rendition */

var assign   = require('es5-ext/object/assign')
  , includes = require('es5-ext/string/#/contains')
  , forOwn   = require('es5-ext/object/for-each')
  , onlyKey  = require('es5-ext/object/first-key')
  , forEachRight = require('es5-ext/array/#/for-each-right')
  , uniq = require('es5-ext/array/#/uniq.js');

var CSI = '\x1b[';

var sgr = function (code) {
	return CSI + code + 'm';
};

sgr.CSI = CSI;

var mods = assign({
	// Style
	bold:      { _bold: [1, 22] },
	italic:    { _italic: [3, 23] },
	underline: { _underline: [4, 24] },
	blink:     { _blink: [5, 25] },
	inverse:   { _inverse: [7, 27] },
	strike:    { _strike: [9, 29] }

	// Color
}, ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
	.reduce(function (obj, color, index) {
		// foreground
		obj[color] = { _fg: [30 + index, 39] };
		obj[color + 'Bright'] = { _fg: [90 + index, 39] };

		// background
		obj['bg' + color[0].toUpperCase() + color.slice(1)] = { _bg: [40 + index, 49] };
		obj['bg' + color[0].toUpperCase() + color.slice(1) + 'Bright'] = { _bg: [100 + index, 49] };

		return obj;
	}, {}));

sgr.mods = mods;

sgr.openers = {};
sgr.closers = {};

forOwn(mods, function (mod) {
	var modPair = mod[onlyKey(mod)];

	sgr.openers[modPair[0]] = modPair;
	sgr.closers[modPair[1]] = modPair;
});

sgr.openStyle = function (mods, code) {
	mods.push(sgr.openers[code]);
};

sgr.closeStyle = function (mods, code) {
	forEachRight.call(mods, function (modPair, index) {
		if (modPair[1] === code) {
			mods.splice(index, 1);
		}
	});
};

/* prepend openers */
sgr.prepend = function (mods) {
	return mods.map(function (modPair, key) {
		return sgr(modPair[0]);
	});
};

/* complete non-closed openers with corresponding closers */
sgr.complete = function (mods, closerCodes) {
	closerCodes.forEach(function (code) {
		sgr.closeStyle(mods, code);
	});

	// mods must be closed from the last opened to first opened
	mods = mods.reverse();

	mods = mods.map(function (modPair, key) {
		return modPair[1];
	});

	// one closer can close many openers (31, 32 -> 39)
	mods = uniq.call(mods);

	return mods.map(sgr);
};

var hasCSI = function (str) {
	return includes.call(str, CSI);
};

sgr.hasCSI = hasCSI;

var extractCode = function (csi) {
	var code = csi.slice(2, -1);
	code = Number(code);
	return code;
};

sgr.extractCode = extractCode;

module.exports = sgr;
