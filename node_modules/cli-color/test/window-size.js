'use strict';

module.exports = function (t, a) {
	a(typeof t.width, 'number', "Width");
	a(typeof t.height, 'number', "Height");
	a(t.width > 0, true);
	a(t.height > 0, true);
};
