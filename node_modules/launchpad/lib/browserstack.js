// Launches browserstack instances
var BrowserStack = require( "browserstack");
var events = require('events');
var debug = require('debug')('launchpad:browserstack');

module.exports = function(configuration, callback) {
	var client = BrowserStack.createClient(configuration);
	var Instance = function(worker) {
		this.id = worker.id;
		this.worker = worker;
	};

  debug('Created client from configuration', configuration);

	Instance.prototype = Object.create(events.EventEmitter.prototype);

	Instance.prototype.stop = function (callback) {
		var self = this;
		client.terminateWorker(this.id, function(err, data) {
			if(err) {
				return callback(err);
			}

      debug('Stopped instance', this.id);
			self.emit('stop', data);

			return callback(null, data);
		});
	};

	Instance.prototype.status = function(callback) {
    debug('Getting instance status', this.id);
		client.getWorker(this.id, callback);
	};

	client.getBrowsers(function(err, browsers) {
		if(err) {
			return callback(err);
		}

    debug('Listed all browsers');

		var api = function(url, settings, callback) {
			settings.url = url;

      debug('Creating worker', settings);
			client.createWorker(settings, function(err, worker) {
				if(err) {
					return callback(err);
				}
				return callback(null, new Instance(worker));
			});
		};
		api.browsers = browsers;
		api.client = client;

		browsers.forEach(function(info) {
      debug('Adding browser to API', info);
			var name = info.browser;
			if(!api[name]) {
				api[name] = function(url, settings, callback) {
					if(!callback) {
						callback = settings;
						settings = {};
					}
					settings.browser = name;
					settings.version = settings.version || 'latest';
					callback(null, new Instance(url, settings, callback));
				};
			}
		});

		return callback(null, api);
	});
};
