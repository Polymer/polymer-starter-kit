var launch = require('../lib');

launch.local(function(err, launcher) {
	// User the launcher api
	launcher('http://github.com/ekryski', {
		browser: 'safari'
	}, function(error, worker) {
		if(error) {
			console.log('Error:', error);
			return;
		}
		console.log('Launched Safari. Process id:', worker.id);
		setTimeout(function() {
			worker.stop(function() {
				console.log('Safari stopped');
			});
		}, 10000);
	});

	// Short hand launcher
	launcher.firefox('http://github.com/daffl', function(error, worker) {
		if(error) {
			console.log('Error:', error);
			return;
		}
		console.log('Launched Firefox. Process id:', worker.id);
		setTimeout(function() {
			worker.stop(function() {
				console.log('Firefox stopped');
			});
		}, 5000);
	});
});