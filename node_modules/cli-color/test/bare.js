'use strict';

module.exports = function (t, a) {
	var x, y;

	a(t('test'), 'test', "Plain");
	a(t('test', 'foo', 3, { toString: function () { return 'bar'; } }),
		'test foo 3 bar', "Plain: Many args");

	a(t.red('foo'), '\x1b[31mfoo\x1b[39m', "Foreground");
	a(t.red('foo', 'bar', 3), '\x1b[31mfoo bar 3\x1b[39m',
		"Foreground: Many args");
	a(t.red.yellow('foo', 'bar', 3), '\x1b[33mfoo bar 3\x1b[39m',
		"Foreground: Overriden");
	a(t.bgRed('foo', 'bar'), '\x1b[41mfoo bar\x1b[49m', "Background");
	a(t.bgRed.bgYellow('foo', 'bar', 3), '\x1b[43mfoo bar 3\x1b[49m',
		"Background: Overriden");

	a(t.blue.bgYellow('foo', 'bar'), '\x1b[43m\x1b[34mfoo bar\x1b[39m\x1b[49m',
		"Foreground & Background");
	a(t.blue.bgYellow.red.bgMagenta('foo', 'bar'),
		'\x1b[45m\x1b[31mfoo bar\x1b[39m\x1b[49m',
		"Foreground & Background: Overriden");

	a(t.bold('foo', 'bar'), '\x1b[1mfoo bar\x1b[22m', "Format");
	a(t.blink('foobar'), '\x1b[5mfoobar\x1b[25m', "Format: blink");
	a(t.bold.blue('foo', 'bar', 3), '\x1b[1m\x1b[34mfoo bar 3\x1b[39m\x1b[22m',
		"Foreground & Format");

	a(t.redBright('foo', 'bar'), '\x1b[91mfoo bar\x1b[39m', "Bright");
	a(t.bgRedBright('foo', 3), '\x1b[101mfoo 3\x1b[49m', "Bright background");

	a(t.blueBright.bgYellowBright.red.bgMagenta('foo', 'bar'),
		'\x1b[45m\x1b[31mfoo bar\x1b[39m\x1b[49m',
		"Foreground & Background: Bright: Overriden");

	a(t.red.blue('foo'), '\x1b[34mfoo\x1b[39m', "Prioritize the Last Color: Blue");
	a(t.blue.red('foo'), '\x1b[31mfoo\x1b[39m', "Prioritize the Last Color: Red");
	a(t.bgRed.bgBlue('foo'), '\x1b[44mfoo\x1b[49m', "Prioritize the Last Background Color: Blue");
	a(t.bgBlue.bgRed('foo'), '\x1b[41mfoo\x1b[49m', "Prioritize the Last Background Color: Red");
	a(t.bgRed.red.bgBlue.blue('foo'),
		'\x1b[44m\x1b[34mfoo\x1b[39m\x1b[49m',
		"Prioritize the Last Mixed Style: Blue");
	a(t.bgBlue.blue.bgRed.red('foo'),
		'\x1b[41m\x1b[31mfoo\x1b[39m\x1b[49m',
		"Prioritize the Last Mixed Style: Red");
	a(t.bgRed.blue.bgBlue.red('foo'),
		'\x1b[44m\x1b[31mfoo\x1b[39m\x1b[49m',
		"Prioritize the Last Mixed Style: BG Blue and Red");
	a(t.bgBlue.red.bgRed.blue('foo'),
		'\x1b[41m\x1b[34mfoo\x1b[39m\x1b[49m',
		"Prioritize the Last Mixed Style: BG Red and Blue");

	a(t.bold('bold ' + t.whiteBright('whiteBright ') + 'bold'),
		'\x1b[1mbold \x1b[97mwhiteBright \x1b[39mbold\x1b[22m',
		"Nested Format: Bold Type 1");
	a(t.white('white ' + t.bold('bold ') + 'white'),
		'\x1b[37mwhite \x1b[1mbold \x1b[22mwhite\x1b[39m',
		"Nested Format: Bold Type 2");

	a(t.italic('italic ' + t.whiteBright('whiteBright ') + 'italic'),
		'\x1b[3mitalic \x1b[97mwhiteBright \x1b[39mitalic\x1b[23m',
		"Nested Format: Italic");
	a(t.white('white ' + t.italic('italic ') + 'white'),
		'\x1b[37mwhite \x1b[3mitalic \x1b[23mwhite\x1b[39m',
		"Nested Format: Italic Type 2");

	a(t.underline('underline ' + t.whiteBright('whiteBright ') + 'underline'),
		'\x1b[4munderline \x1b[97mwhiteBright \x1b[39munderline\x1b[24m',
		"Nested Format: Underline");
	a(t.white('white ' + t.underline('underline ') + 'white'),
		'\x1b[37mwhite \x1b[4munderline \x1b[24mwhite\x1b[39m',
		"Nested Format: Underline Type 2");

	a(t.blink('blink ' + t.whiteBright('whiteBright ') + 'blink'),
		'\x1b[5mblink \x1b[97mwhiteBright \x1b[39mblink\x1b[25m',
		"Nested Format: Blink");
	a(t.white('white ' + t.blink('blink ') + 'white'),
		'\x1b[37mwhite \x1b[5mblink \x1b[25mwhite\x1b[39m',
		"Nested Format: Blink Type 2");

	a(t.inverse('inverse ' + t.whiteBright('whiteBright ') + 'inverse'),
		'\x1b[7minverse \x1b[97mwhiteBright \x1b[39minverse\x1b[27m',
		"Nested Format: Inverse");
	a(t.white('white ' + t.inverse('inverse ') + 'white'),
		'\x1b[37mwhite \x1b[7minverse \x1b[27mwhite\x1b[39m',
		"Nested Format: Inverse Type 2");

	a(t.strike('strike ' + t.whiteBright('whiteBright ') + 'strike'),
		'\x1b[9mstrike \x1b[97mwhiteBright \x1b[39mstrike\x1b[29m',
		"Nested Format: Strike");
	a(t.white('white ' + t.strike('strike ') + 'white'),
		'\x1b[37mwhite \x1b[9mstrike \x1b[29mwhite\x1b[39m',
		"Nested Format: Strike Type 2");

	a(t.red('red ' + t.blue('blue ')),
		'\x1b[31mred \x1b[34mblue \x1b[31m\x1b[39m',
		"Nested Foreground: Two Levels Type 1");
	a(t.red(t.blue('blue ') + 'red'),
		'\x1b[31m\x1b[34mblue \x1b[31mred\x1b[39m',
		"Nested Foreground: Two Levels Type 2");
	a(t.red('red ' + t.blue('blue ') + 'red'),
		'\x1b[31mred \x1b[34mblue \x1b[31mred\x1b[39m',
		"Nested Foreground: Two Levels Type 3");

	a(t.red('red ' + t.blue('blue ' + t.green('green ')) + 'red'),
		'\x1b[31mred \x1b[34mblue \x1b[32mgreen \x1b[34m\x1b[31mred\x1b[39m',
		"Nested Foreground: Three Levels Type 1");
	a(t.red('red ' + t.blue('blue ' + t.green('green ') + 'blue ') + 'red'),
		'\x1b[31mred \x1b[34mblue \x1b[32mgreen \x1b[34mblue \x1b[31mred\x1b[39m',
		"Nested Foreground: Three Levels Type 2");
	a(t.red('red ' + t.blue('blue ' + t.green('green ')) + t.green('green ') + 'red'),
		'\x1b[31mred \x1b[34mblue \x1b[32mgreen \x1b[34m' +
			'\x1b[31m\x1b[32mgreen \x1b[31mred\x1b[39m',
		"Nested Foreground: Three Levels Type 3");
	a(t.red('red ' + t.blue('blue ' + t.green('green ') + t.yellow('yellow ')) + 'red'),
		'\x1b[31mred \x1b[34mblue \x1b[32mgreen \x1b[34m' +
			'\x1b[33myellow \x1b[34m\x1b[31mred\x1b[39m',
		"Nested Foreground: Three Levels Type 4");
	a(t.red('red ' + t.blue('blue ' + t.green('green ') + "blue " + t.yellow('yellow ')) + 'red'),
		'\x1b[31mred \x1b[34mblue \x1b[32mgreen \x1b[34mblue \x1b[33myellow ' +
		'\x1b[34m\x1b[31mred\x1b[39m', "Nested Foreground: Three Levels Type 5");

	a(t.red('red ' + t.blue('blue ' + t.green('green ' + t.yellow('yellow ') + "green ")) + 'red'),
		'\x1b[31mred \x1b[34mblue \x1b[32mgreen \x1b[33myellow \x1b[32mgreen ' +
		'\x1b[34m\x1b[31mred\x1b[39m', "Nested Foreground: Four Levels");

	a(t.red('\x1bAred'),
		'\x1b[31m\x1bAred\x1b[39m',
		"Nested Foreground: Trap Type 1 - Not a Style Before");
	a(t.red('red\x1bA'),
		'\x1b[31mred\x1bA\x1b[39m',
		"Nested Foreground: Trap Type 2 - Not a Style After");
	a(t.red('\x1bAred\x1bA'),
		'\x1b[31m\x1bAred\x1bA\x1b[39m',
		"Nested Foreground: Trap Type 3 - Not a Style Around");
	a(t.red('\x1b34m\x1b39m'),
		'\x1b[31m\x1b34m\x1b39m\x1b[39m',
		"Nested Foreground: Trap Type 4 - Not a Valid Style");
	a(t.red('\x1b[34m\x1b[39m'),
		'\x1b[31m\x1b[34m\x1b[31m\x1b[39m',
		"Nested Foreground: Trap Type 5 - No Message Style");
	a(t.red('\x1b[34m\x1b[39m\x1b[34mblue\x1b[39m'),
		'\x1b[31m\x1b[34m\x1b[31m\x1b[34mblue\x1b[31m\x1b[39m',
		"Nested Foreground: Trap Type 6 - No Message Style Before");
	a(t.red('\x1b[34mblue\x1b[39m\x1b[34m\x1b[39m'),
		'\x1b[31m\x1b[34mblue\x1b[31m\x1b[34m\x1b[31m\x1b[39m',
		"Nested Foreground: Trap Type 7 - No Message Style After");
	a(t.red('\x1b[34m\x1b[39m\x1b[34mblue\x1b[39m\x1b[34m\x1b[39m'),
		'\x1b[31m\x1b[34m\x1b[31m\x1b[34mblue\x1b[31m\x1b[34m\x1b[31m\x1b[39m',
		"Nested Foreground: Trap Type 8 - No Message Style Around");

	a(t.bgRed('red ' + t.bgBlue('blue ')),
		'\x1b[41mred \x1b[44mblue \x1b[41m\x1b[49m',
		"Nested Background: Two Levels Type 1");
	a(t.bgRed(t.bgBlue('blue ') + 'red'),
		'\x1b[41m\x1b[44mblue \x1b[41mred\x1b[49m',
		"Nested Background: Two Levels Type 2");
	a(t.bgRed('red ' + t.bgBlue('blue ') + 'red'),
		'\x1b[41mred \x1b[44mblue \x1b[41mred\x1b[49m',
		"Nested Background: Two Levels Type 3");

	a(t.bgRed('red ' + t.bgBlue('blue ' + t.bgGreen('green ')) + 'red'),
		'\x1b[41mred \x1b[44mblue \x1b[42mgreen \x1b[44m\x1b[41mred\x1b[49m',
		"Nested Background: Three Levels Type 1");
	a(t.bgRed('red ' + t.bgBlue('blue ' + t.bgGreen('green ') + 'blue ') + 'red'),
		'\x1b[41mred \x1b[44mblue \x1b[42mgreen \x1b[44mblue \x1b[41mred\x1b[49m',
		"Nested Background: Three Levels Type 2");
	a(t.bgRed('red ' + t.bgBlue('blue ' + t.bgGreen('green ')) + t.bgGreen('green ') + 'red'),
		'\x1b[41mred \x1b[44mblue \x1b[42mgreen \x1b[44m' +
			'\x1b[41m\x1b[42mgreen \x1b[41mred\x1b[49m',
		"Nested Background: Three Levels Type 3");
	a(t.bgRed('red ' + t.bgBlue('blue ' + t.bgGreen('green ') + t.bgYellow('yellow ')) + 'red'),
		'\x1b[41mred \x1b[44mblue \x1b[42mgreen \x1b[44m' +
			'\x1b[43myellow \x1b[44m\x1b[41mred\x1b[49m',
		"Nested Background: Three Levels Type 4");
	a(t.bgRed('red ' + t.bgBlue('blue ' + t.bgGreen('green ') + "blue " +
			t.bgYellow('yellow ')) + 'red'),
		'\x1b[41mred \x1b[44mblue \x1b[42mgreen \x1b[44mblue \x1b[43myellow ' +
		'\x1b[44m\x1b[41mred\x1b[49m', "Nested Background: Three Levels Type 5");

	a(t.bgRed('red ' + t.bgBlue('blue ' + t.bgGreen('green ' +
			t.bgYellow('yellow ') + "green ")) + 'red'),
		'\x1b[41mred \x1b[44mblue \x1b[42mgreen \x1b[43myellow \x1b[42mgreen ' +
		'\x1b[44m\x1b[41mred\x1b[49m', "Nested Background: Four Levels");

	a(t.bgRed('\x1bAred'),
		'\x1b[41m\x1bAred\x1b[49m',
		"Nested Background: Trap Type 1 - Not a Style Before");
	a(t.bgRed('red\x1bA'),
		'\x1b[41mred\x1bA\x1b[49m',
		"Nested Background: Trap Type 2 - Not a Style After");
	a(t.bgRed('\x1bAred\x1bA'),
		'\x1b[41m\x1bAred\x1bA\x1b[49m',
		"Nested Background: Trap Type 3 - Not a Style Around");
	a(t.bgRed('\x1b44m\x1b39m'),
		'\x1b[41m\x1b44m\x1b39m\x1b[49m',
		"Nested Background: Trap Type 4 - Not a Valid Style");
	a(t.bgRed('\x1b[44m\x1b[49m'),
		'\x1b[41m\x1b[44m\x1b[41m\x1b[49m',
		"Nested Background: Trap Type 5 - No Message Style");
	a(t.bgRed('\x1b[44m\x1b[49m\x1b[44mblue\x1b[49m'),
		'\x1b[41m\x1b[44m\x1b[41m\x1b[44mblue\x1b[41m\x1b[49m',
		"Nested Background: Trap Type 6 - No Message Style Before");
	a(t.bgRed('\x1b[44mblue\x1b[49m\x1b[44m\x1b[49m'),
		'\x1b[41m\x1b[44mblue\x1b[41m\x1b[44m\x1b[41m\x1b[49m',
		"Nested Background: Trap Type 7 - No Message Style After");
	a(t.bgRed('\x1b[44m\x1b[49m\x1b[44mblue\x1b[49m\x1b[44m\x1b[49m'),
		'\x1b[41m\x1b[44m\x1b[41m\x1b[44mblue\x1b[41m\x1b[44m\x1b[41m\x1b[49m',
		"Nested Background: Trap Type 8 - No Message Style Around");

	a(t.red('red ' + t.bgBlue('blue ')),
		'\x1b[31mred \x1b[44mblue \x1b[49m\x1b[39m',
		"Nested Foreground and Background: Two Levels Type 1");
	a(t.red('red ' + t.bgBlue('blue ') + t.white('white')),
		'\x1b[31mred \x1b[44mblue \x1b[49m\x1b[37mwhite\x1b[31m\x1b[39m',
		"Nested Foreground and Background: Two Levels Type 2");
	a(t.red('red ' + t.bgBlue('blue ') + 'red'),
		'\x1b[31mred \x1b[44mblue \x1b[49mred\x1b[39m',
		"Nested Foreground and Background: Two Levels Type 3");
	a(t.bgBlue('blue ' + t.bgRed('red ' + t.whiteBright('white ') + 'red ') + 'blue'),
		'\x1b[44mblue \x1b[41mred \x1b[97mwhite \x1b[39mred \x1b[44mblue\x1b[49m',
		"Nested Foreground and Background: Two Levels Type 3");

	a(t.red.bgWhite('white ' + t.bgBlue('blue')),
		'\x1b[47m\x1b[31mwhite \x1b[44mblue\x1b[47m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Mixed Type 1");
	a(t.red.bgWhite('white ' + t.blue('blue')),
		'\x1b[47m\x1b[31mwhite \x1b[34mblue\x1b[31m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Mixed Type 2");
	a(t.red.bgWhite('white ' + t.blue('blue ') + 'white'),
		'\x1b[47m\x1b[31mwhite \x1b[34mblue \x1b[31mwhite\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Mixed Type 3");

	a(t.red.bgWhite('\x1bAred'),
		'\x1b[47m\x1b[31m\x1bAred\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 1 - Not a Style Before");
	a(t.red.bgWhite('red\x1bA'),
		'\x1b[47m\x1b[31mred\x1bA\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 2 - Not a Style After");
	a(t.red.bgWhite('\x1bAred\x1bA'),
		'\x1b[47m\x1b[31m\x1bAred\x1bA\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 3 - Not a Style Around");
	a(t.red.bgWhite('\x1b34m\x1b39m'),
		'\x1b[47m\x1b[31m\x1b34m\x1b39m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 4 - Not a Valid Style");
	a(t.red.bgWhite('\x1b[34m\x1b[39m'),
		'\x1b[47m\x1b[31m\x1b[34m\x1b[31m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 5 - No Message Style");
	a(t.red.bgWhite('\x1b[44m\x1b[49m'),
		'\x1b[47m\x1b[31m\x1b[44m\x1b[47m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 6 - No Message Style");
	a(t.red.bgWhite('\x1b[44m\x1b[49m\x1b[44mblue\x1b[49m'),
		'\x1b[47m\x1b[31m\x1b[44m\x1b[47m\x1b[44mblue\x1b[47m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 7 - No Message Style Before");
	a(t.red.bgWhite('\x1b[44mblue\x1b[49m\x1b[44m\x1b[49m'),
		'\x1b[47m\x1b[31m\x1b[44mblue\x1b[47m\x1b[44m\x1b[47m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 8 - No Message Style After");
	a(t.red.bgWhite('\x1b[44m\x1b[49m\x1b[44mblue\x1b[49m\x1b[44m\x1b[49m'),
		'\x1b[47m\x1b[31m\x1b[44m\x1b[47m\x1b[44mblue\x1b[47m\x1b[44m\x1b[47m\x1b[39m\x1b[49m',
		"Nested Foreground and Background: Trap Type 9 - No Message Style Around");

	x = t.red;
	y = x.bold;

	a(x('foo', 'red') + ' ' + y('foo', 'boldred'),
		'\x1b[31mfoo red\x1b[39m \x1b[1m\x1b[31mfoo boldred\x1b[39m\x1b[22m',
		"Detached extension");

	if (t.xtermSupported) {
		a(t.xterm(12).bgXterm(67)('foo', 'xterm'),
			'\x1b[48;5;67m\x1b[38;5;12mfoo xterm\x1b[39m\x1b[49m', "Xterm");

		a(t.redBright.bgBlueBright.xterm(12).bgXterm(67)('foo', 'xterm'),
			'\x1b[48;5;67m\x1b[38;5;12mfoo xterm\x1b[39m\x1b[49m',
			"Xterm: Override & Bright");
		a(t.xterm(12).bgXterm(67).redBright.bgMagentaBright('foo', 'xterm'),
			'\x1b[105m\x1b[91mfoo xterm\x1b[39m\x1b[49m',
			"Xterm: Override & Bright #2");
	} else {
		a(t.xterm(12).bgXterm(67)('foo', 'xterm'),
			'\x1b[100m\x1b[94mfoo xterm\x1b[39m\x1b[49m', "Xterm");
	}
};
