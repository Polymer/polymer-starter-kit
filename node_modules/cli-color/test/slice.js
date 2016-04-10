'use strict';

module.exports = function (t, a) {
	var slice = t;

	a(typeof slice, 'function');

	a(slice('ABCDE',  1), "BCDE", "Works on plain string");
	a(slice('ABCDE', -1),    "E", "Works on plain string");
	a(slice('ABCDE', 1, 3), "BC", "Works on plain string");
	a(slice('ABCDE', -3, -1), "CD", "Works on plain string");

	a(slice('\x1b[31mABCDE\x1b[39m', 1), "\x1b[31mBCDE\x1b[39m",
		"Works on whole single forecolor-styled string");
	a(slice('\x1b[31mABCDE\x1b[39m', -1), "\x1b[31mE\x1b[39m",
		"Works on whole single forecolor-styled string");
	a(slice('\x1b[31mABCDE\x1b[39m', 1, 3), "\x1b[31mBC\x1b[39m",
		"Works on whole single forecolor-styled string");
	a(slice('\x1b[31mABCDE\x1b[39m', -3, -1), "\x1b[31mCD\x1b[39m",
		"Works on whole single forecolor-styled string");

	a(slice('\x1b[41mABCDE\x1b[49m', 1), "\x1b[41mBCDE\x1b[49m",
		"Works on whole single backcolor-styled string");
	a(slice('\x1b[41mABCDE\x1b[49m', -1), "\x1b[41mE\x1b[49m",
		"Works on whole single backcolor-styled string");
	a(slice('\x1b[41mABCDE\x1b[49m', 1, 3), "\x1b[41mBC\x1b[49m",
		"Works on whole single backcolor-styled string");
	a(slice('\x1b[41mABCDE\x1b[49m', -3, -1), "\x1b[41mCD\x1b[49m",
		"Works on whole single backcolor-styled string");

	a(slice('ABC\x1b[31mDEF\x1b[39m', 0, 5), "ABC\x1b[31mDE\x1b[39m",
		"Save styles when chopping part of the forecolor-styled string");
	a(slice('ABC\x1b[31mDEF\x1b[39m', 1, 4), "BC\x1b[31mD\x1b[39m",
		"Save styles when chopping part of the forecolor-styled string");
	a(slice('ABC\x1b[31mDEF\x1b[39m', 1, 6), "BC\x1b[31mDEF\x1b[39m",
		"Save styles when chopping part of the forecolor-styled string");
	a(slice('ABC\x1b[31mDEF\x1b[39m', -5, -1), "BC\x1b[31mDE\x1b[39m",
		"Save styles when chopping part of the forecolor-styled string");

	a(slice('ABC\x1b[41mDEF\x1b[49m', 0, 5), "ABC\x1b[41mDE\x1b[49m",
		"Save styles when chopping part of the backcolor-styled string");
	a(slice('ABC\x1b[41mDEF\x1b[49m', 1, 4), "BC\x1b[41mD\x1b[49m",
		"Save styles when chopping part of the backcolor-styled string");
	a(slice('ABC\x1b[41mDEF\x1b[49m', 1, 6), "BC\x1b[41mDEF\x1b[49m",
		"Save styles when chopping part of the backcolor-styled string");
	a(slice('ABC\x1b[41mDEF\x1b[49m', -5, -1), "BC\x1b[41mDE\x1b[49m",
		"Save styles when chopping part of the backcolor-styled string");

	a(slice('\x1b[1mAAA\x1b[31mBBB\x1b[39mAAA\x1b[22m', 0, 5), "\x1b[1mAAA\x1b[31mBB\x1b[39m\x1b[22m",
		"Works with nested styles #1");
	a(slice('\x1b[1mAAA\x1b[31mBBB\x1b[39mAAA\x1b[22m', 2, 7), "\x1b[1mA\x1b[31mBBB\x1b[39mA\x1b[22m",
		"Works with nested styles #2");
	a(slice('\x1b[3mAAA\x1b[41mBBB\x1b[49mAAA\x1b[23m', 0, 5), "\x1b[3mAAA\x1b[41mBB\x1b[49m\x1b[23m",
		"Works with nested styles #3");
	a(slice('\x1b[3mAAA\x1b[41mBBB\x1b[49mAAA\x1b[23m', 2, 7), "\x1b[3mA\x1b[41mBBB\x1b[49mA\x1b[23m",
		"Works with nested styles #4");
	a(slice('\x1b[3mAAA\x1b[41mBBB\x1b[49mAAA\x1b[23m', -8, -1),
		"\x1b[3mAA\x1b[41mBBB\x1b[49mAA\x1b[23m",
		"Works with nested styles #5");

	a(slice('\x1b[31mAAA\x1b[32mBBB\x1b[31mAAA\x1b[39m', 0, 5),
		"\x1b[31mAAA\x1b[32mBB\x1b[39m",
		"Works with nested overlapping styles #1");
	a(slice('\x1b[31mAAA\x1b[32mBBB\x1b[31mAAA\x1b[39m', 2, 7),
		"\x1b[31mA\x1b[32mBBB\x1b[31mA\x1b[39m",
		"Works with nested overlapping styles #2");
	a(slice('\x1b[31mAAA\x1b[32mBBB\x1b[31mAAA\x1b[39m', -8, -1),
		"\x1b[31mAA\x1b[32mBBB\x1b[31mAA\x1b[39m",
		"Works with nested overlapping styles #3");

	/* CSI at the edge of slice */
	a(slice('ABC\x1b[31mDEF\x1b[39m', 3), "\x1b[31mDEF\x1b[39m", "Does not corrupt start CSI");
	a(slice('\x1b[41mABC\x1b[49mDEF', 0, 3), "\x1b[41mABC\x1b[49m", "Does not corrupt end CSI");

	/* CSI-reducing tests */
	a(slice('ABC\x1b[31mDEF\x1b[39m', 0, 3), "ABC", "Does not mixin CSI to plain string");
	a(slice('ABCD\x1b[31mEF\x1b[39m', 0, 3), "ABC", "Does not mixin CSI to plain string");
	a(slice('\x1b[41mABC\x1b[49mDEF', 3), "DEF", "Does not mixin CSI to plain string");
	a(slice('\x1b[41mAB\x1b[49mCDEF', 3), "DEF", "Does not mixin CSI to plain string");

	a(slice('A\x1b[31mBBB\x1b[39mD\x1b[32mE\x1b[39m', 2, 3), "\x1b[31mB\x1b[39m",
		"Does slice with surrounding styles");
	a(slice('A\x1b[31mBBB\x1b[39mD\x1b[32mE\x1b[39m', 0, 5), "A\x1b[31mBBB\x1b[39mD",
		"Does slice with inner styles");

	a(slice('A\x1b[31mBBB\x1b[39m\x1b[2J\x1b[0;0H', 0, 4), "A\x1b[31mBBB\x1b[39m",
		"Remove reset CSI");

	// 'A' + clc.red('BBB') + clc.erase.screen + clc.move.to(0, 0)
	a(slice('A\u001b[31mBBB\u001b[39m\u001b[2J\u001b[1;1H', 0, 4), "A\x1b[31mBBB\x1b[39m",
		"Remove control CSIs");
};
