'use strict';

module.exports = function (t, a) {
	a(t.up(), '', "Up: No argument");
	a(t.up({}), '', "Up: Not a number");
	a(t.up(-34), '', "Up: Negative");
	a(t.up(34), '\x1b[34A', "Up: Positive");

	a(t.down(), '', "Down: No argument");
	a(t.down({}), '', "Down: Not a number");
	a(t.down(-34), '', "Down: Negative");
	a(t.down(34), '\x1b[34B', "Down: Positive");

	a(t.right(), '', "Right: No argument");
	a(t.right({}), '', "Right: Not a number");
	a(t.right(-34), '', "Right: Negative");
	a(t.right(34), '\x1b[34C', "Right: Positive");

	a(t.left(), '', "Left: No argument");
	a(t.left({}), '', "Left: Not a number");
	a(t.left(-34), '', "Left: Negative");
	a(t.left(34), '\x1b[34D', "Left: Positive");

	a(t(), '', "Move: No arguments");
	a(t({}, {}), '', "Move: Bad arguments");
	a(t({}, 12), '\x1b[12B', "Move: One direction");
	a(t(0, -12), '\x1b[12A', "Move: One negative direction");
	a(t(-42, -2), '\x1b[42D\x1b[2A', "Move: two negatives");
	a(t(2, 35), '\x1b[2C\x1b[35B', "Move: two positives");

	a(t.to(), '\x1b[1;1H', "MoveTo: No arguments");
	a(t.to({}, {}), '\x1b[1;1H', "MoveTo: Bad arguments");
	a(t.to({}, 12), '\x1b[13;1H', "MoveTo: One direction");
	a(t.to(2, -12), '\x1b[1;3H', "MoveTo: One negative direction");
	a(t.to(-42, -2), '\x1b[1;1H', "MoveTo: two negatives");
	a(t.to(2, 35), '\x1b[36;3H', "MoveTo: two positives");
};
