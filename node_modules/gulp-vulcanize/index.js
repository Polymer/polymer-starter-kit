'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Vulcanize = require('vulcanize');

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}

		(new Vulcanize(opts)).process(file.path, function (err, inlinedHtml) {
			if (err) {
				cb(new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
				return;
			}

			file.contents = new Buffer(inlinedHtml);
			cb(null, file);
		}.bind(this));
	});
};
