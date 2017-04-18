var launch = require('../lib');

launch.browserstack({
	username : '<browserstack username>',
	password : '<browserstack password>'
}, function(err, launcher) {
	launcher('http://github.com', {
		browser : 'firefox',
		version : 'latest',
		os : 'win'
	}, function(err, worker) {
		console.log('Started browser', worker.id);
		worker.status(function(error, status) {
			console.log('Browser status is:', status);
			setTimeout(function() {
				worker.stop(function(err, worker) {
					console.log('Stopped browser', worker);
				});
			}, 5000);
		})
	});
});