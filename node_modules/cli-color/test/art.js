'use strict';

var clc = require('../');

module.exports = function (t, a) {
	a(t('ooo', { o: clc.yellow("x") }),
		'\x1b[33mx\x1b[39m\x1b[33mx\x1b[39m\x1b[33mx\x1b[39m',
		"Basic art");

	a(t('oyo', { o: clc.yellow("x") }),
		'\x1b[33mx\x1b[39my\x1b[33mx\x1b[39m',
		"Free text art");
	a(t('o o', { o: clc.yellow("x") }),
		'\x1b[33mx\x1b[39m \x1b[33mx\x1b[39m',
		"Spaced art");

	a(t('<=>', { "<": clc.yellow("<"), ">": clc.yellow(">") }),
		'\x1b[33m<\x1b[39m=\x1b[33m>\x1b[39m',
		"Symbol art");

	a(t('o\no', { o: clc.yellow("x") }),
		'\x1b[33mx\x1b[39m\n\x1b[33mx\x1b[39m',
		"Multiline art");

	a(t('ooo', {}),
		'ooo',
		"Only text art");
};
