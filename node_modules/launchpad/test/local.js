var assert = require('assert');
var http = require('http');
var path = require('path');
var decache = require('decache');
var useragent = require('useragent');
var familyMapping = {
  canary: 'chrome',
  phantom: 'phantomjs',
  nodeWebkit: 'chrome'
};
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(6785);

describe('Local browser launcher tests', function() {

  describe('Default env settings', function () {

    var local = require('../lib/local');

    it('does local browser and version discovery', function (done) {
      local(function (error, launcher) {
        launcher.browsers(function (error, browsers) {
          assert.ok(!error, 'No error discovering browsers');
          assert.ok(browsers.length, 'Found at least one browser');
          assert.ok(browsers[0].version, 'First browser has a version');
          assert.ok(browsers[0].path, 'First browser has a path');
          assert.ok(browsers[0].binPath, 'First browser has a binPath');
          done();
        });
      });
    });

    Object.keys(local.platform).forEach(function (name) {
      it('Launches ' + name + ' browser on ' + process.platform, function (done) {
        local(function (error, launcher) {
          launcher[name]('http://localhost:6785', function (error, instance) {
            if (error) {
              // That's the only error we should get
              assert.equal(error.message, 'Browser ' + name + ' not available.');
              return done();
            }

            server.once('request', function (req) {
              var userAgent = useragent.parse(req.headers['user-agent']);
              var expected = familyMapping[name] || name;

              assert.equal(userAgent.family.toLowerCase(), expected, 'Got expected browser family');
              instance.stop(done);
            });
          });
        });
      });
    });
  });

  describe('Custom env settings', function () {

    decache(path.join(__dirname, '..', 'lib', 'local', 'index.js'));

    process.env.LAUNCHPAD_BROWSERS = 'phantom';
    process.env.LAUNCHPAD_PHANTOM = /^win/.test(process.platform) ?
        path.join(__dirname, '..', 'node_modules', 'phantomjs', 'lib', 'phantom', 'phantomjs.exe') :
        path.join(__dirname, '..', 'node_modules', 'phantomjs', 'bin', 'phantomjs');

    var local = require('../lib/local');

    it('detects PhantomJS only due to env settings', function (done) {
      local(function (error, launcher) {
        launcher.browsers(function (error, browsers) {
          assert.ok(!error, 'No error discovering browsers');
          assert.ok(browsers.length == 1, 'Found PhantomJS browser');
          assert.ok(browsers[0].path == process.env.LAUNCHPAD_PHANTOM, 'Found PhantomJS at selected location');
          done();
        });
      });
    });
  });
});
