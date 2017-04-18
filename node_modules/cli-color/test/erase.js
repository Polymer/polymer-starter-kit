'use strict';

module.exports = function (t, a) {
	a(t.screen, '\x1b[2J');
	a(t.line, '\x1b[2K');
};
