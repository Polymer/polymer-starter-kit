'use strict';

var clc = require('../');

module.exports = function (t, a) {
	var x = clc.red
	  , y = x.bold;

	a(t('test'), 'test', "Plain");

	a(t('\x1bA'), '', "Simple Command Type 1");
	a(t('\x9bA'), '', "Simple Command Type 2");

	a(t('\x1b[0A'), '', "Single Command");
	a(t('\x1b[0;A'), '', "Single Separated Command");
	a(t('\x1b[0;0A'), '', "Two Commands");
	a(t('\x1b[0;0;A'), '', "Two Separated Commands");

	// Base on index tests.
	a(t(clc.red('foo')), 'foo', "Foreground");
	a(t(clc.red('foo', 'bar', 3)), 'foo bar 3', "Foreground: Many args");
	a(t(clc.red.yellow('foo', 'bar', 3)), 'foo bar 3', "Foreground: Overriden");
	a(t(clc.bgRed('foo', 'bar')), 'foo bar', "Background");
	a(t(clc.bgRed.bgYellow('foo', 'bar', 3)), 'foo bar 3', "Background: Overriden");

	a(t(clc.blue.bgYellow('foo', 'bar')), 'foo bar', "Foreground & Background");
	a(t(clc.blue.bgYellow.red.bgMagenta('foo', 'bar')),
		'foo bar',
		"Foreground & Background: Overriden");

	a(t(clc.bold('foo', 'bar')), 'foo bar', "Format");
	a(t(clc.blink('foobar')), 'foobar', "Format: blink");
	a(t(clc.bold.blue('foo', 'bar', 3)), 'foo bar 3', "Foreground & Format");

	a(t(clc.redBright('foo', 'bar')), 'foo bar', "Bright");
	a(t(clc.bgRedBright('foo', 3)), 'foo 3', "Bright background");

	a(t(clc.blueBright.bgYellowBright.red.bgMagenta('foo', 'bar')),
		'foo bar',
		"Foreground & Background: Bright: Overriden");

	a(t(clc.red.blue('foo')), 'foo', "Prioritize the Last Color: Blue");
	a(t(clc.blue.red('foo')), 'foo', "Prioritize the Last Color: Red");
	a(t(clc.bgRed.bgBlue('foo')), 'foo', "Prioritize the Last Background Color: Blue");
	a(t(clc.bgBlue.bgRed('foo')), 'foo', "Prioritize the Last Background Color: Red");
	a(t(clc.bgRed.red.bgBlue.blue('foo')), 'foo', "Prioritize the Last Mixed Style: Blue");
	a(t(clc.bgBlue.blue.bgRed.red('foo')), 'foo', "Prioritize the Last Mixed Style: Red");
	a(t(clc.bgRed.blue.bgBlue.red('foo')),
		'foo',
		"Prioritize the Last Mixed Style: BG Blue and Red");
	a(t(clc.bgBlue.red.bgRed.blue('foo')),
		'foo',
		"Prioritize the Last Mixed Style: BG Red and Blue");

	a(t(x('foo', 'red') + ' ' + y('foo', 'boldred')),
		'foo red foo boldred',
		"Detached extension");

	a(t(clc.erase.screen).replace(/\n/g, ''), '', "Reset");

	a(t(clc.move.up()), '', "Up: No argument");
	a(t(clc.move.up({})), '', "Up: Not a number");
	a(t(clc.move.up(-34)), '', "Up: Negative");
	a(t(clc.move.up(34)), '', "Up: Positive");

	a(t(clc.move.down()), '', "Down: No argument");
	a(t(clc.move.down({})), '', "Down: Not a number");
	a(t(clc.move.down(-34)), '', "Down: Negative");
	a(t(clc.move.down(34)), '', "Down: Positive");

	a(t(clc.move.right()), '', "Right: No argument");
	a(t(clc.move.right({})), '', "Right: Not a number");
	a(t(clc.move.right(-34)), '', "Right: Negative");
	a(t(clc.move.right(34)), '', "Right: Positive");

	a(t(clc.move.left()), '', "Left: No argument");
	a(t(clc.move.left({})), '', "Left: Not a number");
	a(t(clc.move.left(-34)), '', "Left: Negative");
	a(t(clc.move.left(34)), '', "Left: Positive");

	a(t(clc.move()), '', "Move: No arguments");
	a(t(clc.move({}, {})), '', "Move: Bad arguments");
	a(t(clc.move({}, 12)), '', "Move: One direction");
	a(t(clc.move(0, -12)), '', "Move: One negative direction");
	a(t(clc.move(-42, -2)), '', "Move: two negatives");
	a(t(clc.move(2, 35)), '', "Move: two positives");

	a(t(clc.move.to()), '', "MoveTo: No arguments");
	a(t(clc.move.to({}, {})), '', "MoveTo: Bad arguments");
	a(t(clc.move.to({}, 12)), '', "MoveTo: One direction");
	a(t(clc.move.to(2, -12)), '', "MoveTo: One negative direction");
	a(t(clc.move.to(-42, -2)), '', "MoveTo: two negatives");
	a(t(clc.move.to(2, 35)), '', "MoveTo: two positives");

	a(t(clc.beep), clc.beep, "Beep");

	a(t('test'), 'test', "Plain");
};
