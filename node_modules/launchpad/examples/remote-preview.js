var launch = require('../lib');

launch.remotePreview(function(err, launcher) {
	// User the launcher api
	launcher('http://github.com/daffl', {
		file: 'url.txt'
	}, function(error, worker) {
		console.log(worker);
	});
});