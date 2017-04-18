'use strict';

module.exports = function (sgr, a) {
	a(sgr(31), '\x1b[31m', "sgr creates set graphic rendition CSIs #1");
	a(sgr(39), '\x1b[39m', "sgr creates set graphic rendition CSIs #2");

	a(sgr.hasCSI('\x1b[31mA\x1b[39m'), true, "sgr.hasCSI detecs CSIs in string #1");
	a(sgr.hasCSI('\x1b[31m'), true, "sgr.hasCSI detecs CSIs in string #2");
	a(sgr.hasCSI('[31m'), false, "sgr.hasCSI detecs CSIs in string #3");
	a(sgr.hasCSI('A'), false, "sgr.hasCSI detecs CSIs in string #4");

	a(sgr.extractCode('\x1b[31m'), 31, "sgr.extractCode extract numeric code of CSI");
	a(sgr.extractCode('\x1b[39m'), 39, "sgr.extractCode extract numeric code of CSI");
};
