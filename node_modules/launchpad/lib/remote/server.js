var restify = require('restify');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var localLauncher = require('../local');
var pkg = require('../../package.json');
var platforms = {
	win32 : 'win',
	darwin : 'macos',
	linux : 'unix',
	freebsd : 'unix',
	sunos : 'unix'
};

module.exports = function (config) {
	var emitter = new EventEmitter();
	var configuration = _.extend({
		port : 7998
	}, config);

	if (!configuration.username || !configuration.password) {
		throw new Error('Launchpad server configuration: username and password have to be provided and can not be empty');
	}

	var server = restify.createServer({
		name : 'launchpad-server',
		// Behold the power of a simple package.json
		version : pkg.version
	});

	var workers = {};
	var workerInfo = {};

	var api = {
		index : function (req, res) {
			// Our index is just an empty object
			res.send({});
		},
		listBrowsers : function (req, res, next) {
			// Sends the list of locally available browsers
			localLauncher(function (error, local) {
				if (error) return next(error);
				res.send(local.browsers);
			});
		},
		listWorkers : function (req, res) {
			// Sends a list with information of all workers
			res.send(_.values(workerInfo));
		},
		getWorker : function (req, res, next) {
			if (!workerInfo[req.params.id]) {
				res.status(404);
				return next(new Error('Process does not exist.'));
			}
			// Just send the worker info
			res.send(workerInfo[req.params.id]);
		},
		stopWorker : function (req, res, next) {
			var id = req.params.id;
			if (!workers[id]) {
				res.status(404);
				return next(new Error('Process does not exist or is already stopped.'));
			}

			workers[id].stop(function () {
				// The BrowserStack API returns the runtime of a stopped worker.
				// Not sure if in seconds or ms. We do it in ms
				var time = workerInfo[id].stopped - workerInfo[id].started;
				res.send({ time : time });
			});
		},
		createWorker : function (req, res, next) {
			var config = req.body;
			var getTime = function () {
				return new Date().getTime();
			};
			localLauncher(function (error, local) {
				config.url = config.url.replace(/localhost/, req.connection.remoteAddress);
				// Launch the local browser with the given URL and configuration
				local(config.url, _.omit(config, 'url'), function (error, worker, browser) {
					if (error) return next(error);

					// worker.id is the local browser PID
					var id = worker.id;
					workers[id] = worker;
					// Additionally to what the Browserstack API should provide we store `started` and `stopped` times
					workerInfo[id] = _.extend({
						id : id,
						status : 'running',
						started : getTime(),
						os : platforms[process.platform] || 'unknown'
					}, browser);

					emitter.emit('started', workerInfo[id], worker);
					// Whenever the process stops for whatever reason, update the worker information
					worker.on('stop', function () {
						workerInfo[id].status = 'stopped';
						workerInfo[id].stopped = getTime();
						emitter.emit('stopped', workerInfo[id]);
						delete workers[id];
					});

					res.send({ id : id });
				});
			});
		}
	};

	server.use(function (req, res, next) {
			// We have to drop this in here because some clients don't send their request content type for POSTS
			if (req.method === 'POST' && req.contentType === 'application/octet-stream') {
				req.contentType = 'application/x-www-form-urlencoded';
			}
			next();
		})
		// Some standard node-restify configuration
		.use(restify.acceptParser(server.acceptable))
		.use(restify.queryParser())
		.use(restify.bodyParser({ mapParams : false }))
		.use(restify.authorizationParser())
		// For our basic authorization we just compare with the configuration username and password
		.use(function (req, res, next) {
			// Simple BASIC authorization
			if (req.authorization && req.authorization.basic &&
				req.authorization.basic.username === configuration.username &&
				req.authorization.basic.password === configuration.password) {
					emitter.emit('authorized', req, res);
					return next();
			}
			res.status(401); // Not authorized
			next(new Error('You are not authorized'));
		});

	server.get('/', api.index);
	server.get('/1/browsers', api.listBrowsers);
	server.get('/1/worker', api.listWorkers);
	server.get('/1/worker/:id', api.getWorker);
	server.del('/1/worker/:id', api.stopWorker);
	server.post('/1/worker', api.createWorker);

	server.listen(configuration.port, function() {
		emitter.emit('listening', configuration, server);
	});

	server.on('uncaughtException', function (request, response, route, error) { // jshint ignore:line
		console.log(arguments);
	});

	return emitter;
};
