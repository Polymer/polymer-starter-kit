'use strict';

var clc = require('../');

console.log('Erasing screen ..');

setTimeout(function () {
	process.stdout.write(clc.erase.screen);

	console.log('This a line of text that should not be cleared');
	process.stdout.write('This line will be cleared but cursor will be here ->');

	setTimeout(function () {
		process.stdout.write(clc.erase.line);
		process.stdout.write('\nMoving cursor backwards and deleting (from here): to the right');

		setTimeout(function () {
			process.stdout.write(clc.move(-13, 0));
			process.stdout.write(clc.erase.lineRight);
			setTimeout(function () {}, 2000);
		}, 2000);

	}, 2000);

}, 2000);
