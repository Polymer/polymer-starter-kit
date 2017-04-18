var
  expand = require('../lib/browsers').expand,
  expect = require('chai').expect,
  slice = Array.prototype.slice,
  _ = require('lodash')
;

const DEFAULT_BROWSERS = require('../default-sauce-browsers.json');
const DEFAULT_OPTIONS = {
  accessKey: 'access-key-' + Date.now(),
  browsers: ['default'],
  username: 'catpants-' + Date.now()
};
const DEFAULT_URL = {
  accessKey: DEFAULT_OPTIONS.accessKey,
  hostname: 'ondemand.saucelabs.com',
  port: 80,
  username: DEFAULT_OPTIONS.username
};

function browserOptions() {
  var options = _.cloneDeep(DEFAULT_OPTIONS);
  options.browsers = slice.call(arguments);

  return options;
}

describe('expand', function() {
  ['all', 'default'].forEach(function(keyword) {
    it('should respect browser keyword: ' + keyword, function(done) {
      expand(browserOptions(keyword), function(error, browsers) {
        expect(browsers).to.have.length(DEFAULT_BROWSERS.length);

        browsers.forEach(function(browser) {
          expect(browser).to.have.all.keys('browserName', 'platform', 'url', 'version');

          expect(browser.url).to.deep.equal(DEFAULT_URL);
        });

        done();
      });
    });
  });

  it('should remove bad browser instances', function(done) {
    expand(browserOptions('default', null, 'all', 0, false, 'What?'), function(error, browsers) {
      expect(browsers).to.have.length(DEFAULT_BROWSERS.length);

      browsers.forEach(function(browser) {
        expect(browser).to.have.all.keys('browserName', 'platform', 'url', 'version');

        expect(browser.url).to.deep.equal(DEFAULT_URL);
      });

      done();
    });
  });

  it('should allow objects to pass through', function(done) {
    var browser = {foo: 'bar', baz: 1};

    expand(browserOptions(browser), function(error, browsers) {
      expect(browsers).to.have.length(1);

      expect(browsers[0]).to.deep.equal(browser);

      done();
    });
  });

  it('should pass custom browsers', function(done) {
    var
      browser = 'browers name here',
      platform = 'os or platform',
      version = String(Date.now())
    ;

    expand(browserOptions(platform + '/' + browser + '@' + version), function(error, browsers) {
      var result;

      expect(browsers).to.have.length(1);

      result = browsers[0];

      expect(result).to.have.property('browserName', browser);
      expect(result).to.have.property('platform', platform);
      expect(result).to.have.property('version', version);
      expect(result.url).to.deep.equal(DEFAULT_URL);

      done();
    });
  });

  it('should extend browsers with custom metadata', function(done) {
    var
      buildNumber = Date.now(),
      customName = 'custom name ' + Date.now(),
      options = browserOptions('platform/browser@eleventy', 'default'),
      tags = ['custom', 'tags', 'here']
    ;

    _.extend(options, {
      build: buildNumber,
      disabled: true,
      name: customName,
      tags: tags
    });

    expand(options, function(error, browsers) {
      expect(browsers).to.have.length(DEFAULT_BROWSERS.length + 1);

      browsers.forEach(function(browser) {
        expect(browser).to.contain.all.keys('browserName', 'platform', 'url', 'version');

        expect(browser).to.have.property('build', buildNumber);
        expect(browser).to.have.property('name', customName);
        expect(browser).to.have.property('tags', tags);
        expect(browser.url).to.deep.equal(DEFAULT_URL);

        expect(browser).to.not.have.keys('browsers', 'disabled');
      });

      done();
    });
  });
});
