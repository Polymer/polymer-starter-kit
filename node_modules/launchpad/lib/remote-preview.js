var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var debug = require('debug')('launchpad:remote-preview');

module.exports = function(configuration, callback) {
	if(!callback) {
		callback = configuration;
	}

	var api = function (url, options, callback) {
		var path = options.file;
		fs.writeFile(path, url, function(error) {
      debug('Wrote URL ' + url + ' to file ' + path);
			var emitter = new EventEmitter();
			_.extend(emitter, {
				id: path,
				stop: function(callback) {
          debug('Stopping remote-preview');
					callback(null, this);
				},
				status: function(callback) {
					// TODO fs.stat
					callback(null, path);
				}
			});
			callback(error, emitter);
		});
	};

	callback(null, api);
};
