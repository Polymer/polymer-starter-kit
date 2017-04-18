var launch = require('../lib');
var expect = require('expect.js');
var fs = require('fs');

describe('Remote Preview launcher', function() {
	it('Writes URL to file', function(done) {
		// TODO generate random URL
		launch.remotePreview(function(err, launcher) {
			// User the launcher api
			launcher('http://github.com/ekryski', {
				file: 'test/fixtures/url.txt'
			}, function(error, worker) {
				fs.readFile(worker.id, function(error, content) {
					expect(content.toString()).to.equal('http://github.com/ekryski');
					done(error);
				});
			});
		});
	});
});
