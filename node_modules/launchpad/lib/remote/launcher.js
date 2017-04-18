var browserstack = require('../browserstack');
var _ = require('underscore');

module.exports = function(configuration, callback) {
	// We are just using the BrowserStack launcher with a slightly modified configuration
	var config = _.pick(configuration, 'username', 'password');
	config.version = 1;
	config.server = {
		// The magic is to just point it to a host other than `api.browserstack.com`
		host : configuration.host || 'localhost',
		port : configuration.port || 7998
	};
	browserstack(config, callback);
};
