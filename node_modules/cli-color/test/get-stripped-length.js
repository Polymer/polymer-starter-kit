'use strict';

module.exports = function (t, a) {
	var length = t;

	a(typeof length, 'function');

	a(length('ABC'), 3, "Works on plain string");
	a(length('\x1b[31mABC\x1b[39m'), 3, "Works on formatted string");
	a(length('\x1b[31mABC\x1b[39mDE'), 5, "Works on partially formatted string");
	a(length('\x1b[31mABC\x1b[39mDE'), 5, "Works on formatted string by couple of styles");

	a(length('\x1b[31mABC\x1b[3mDE\x1b[23m\x1b[39m'), 5, "Works on nested formatted string");
	a(length('\x1b[31mAAA\x1b[32mBBB\x1b[31mAAA\x1b[39m'), 9,
		"Works on nested formatted string with overlapping styles");
};
