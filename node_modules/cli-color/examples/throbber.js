'use strict';

var setupThrobber = require('../throbber');

var throbber = setupThrobber(function (str) {
	process.stdout.write(str);
}, 200);

process.stdout.write('Throbbing for 3 seconds here -> ');
throbber.start();

setTimeout(function () {
	console.log();
	throbber.stop();
}, 3000);
