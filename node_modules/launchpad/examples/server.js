var launch = require('../lib');

var emitter = launch.server({
	username : 'launcher',
	password : 'testing',
	port : 8080
});

emitter.on('listening', function(configuration, server) {
	console.log('Listening on port', configuration.port);
});

emitter.on('authorized', function(req, res) {
	console.log('Authorized', req.authorization.basic.username);
});

emitter.on('started', function(info, instance) {
	console.log('Started browser', info)
});

emitter.on('stopped', function(info) {
	console.log('Stopped browser', info);
});
