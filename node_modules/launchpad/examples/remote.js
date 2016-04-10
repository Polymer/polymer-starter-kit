var launch = require('../lib');

launch.remote({
	port : 8080,
	host : 'localhost',
	username : 'launcher',
	password : 'testing'
}, function(err, launcher) {
	launcher('http://github.com', {
		browser : 'firefox',
		version : 'latest'
	}, function(err, worker) {
		console.log('Started browser', worker.id);
		worker.status(function(status) {
			console.log('Browser status is:', status);
			setTimeout(function() {
				worker.stop(function(err, worker) {
					console.log('Stopped browser', worker);
				});
			}, 5000);
		})
	});
});