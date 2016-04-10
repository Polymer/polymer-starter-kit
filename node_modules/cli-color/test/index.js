'use strict';

var bareTests = require('./bare');

module.exports = function (t, a) {
	bareTests(t, a);

	a(typeof t.windowSize.width, 'number', "Width");

	a(t.move.up(34), '\x1b[34A', "Up: Positive");
	a(t.move(2, 35), '\x1b[2C\x1b[35B', "Move: two positives");

	a(t.erase.screen, '\x1b[2J', "Erase");

	a(t.beep, '\x07', "Beep");
};
