var expect    = require('chai').expect;
var express   = require('express');
var path      = require('path');
var supertest = require('supertest');

var serveWaterfall = require('../lib');

var FIXTURES = path.join(__dirname, 'fixtures');

describe('serveWaterfall', function() {

  it('uses the current directory as root by default', function(done) {
    process.chdir(FIXTURES);
    supertest(serveWaterfall(serveWaterfall.mappings.STATIC))
        .get('/x-bar/x-bar.html')
        .expect(200)
        .expect('x-bar\n', done);
  });

  it('supports options.headers', function(done) {
    var app = serveWaterfall(serveWaterfall.mappings.STATIC, {
      root: FIXTURES,
      headers: {
        'X-Thing': 'abc123',
        'X-Stuff': 'foobar',
      }
    });
    supertest(app)
        .get('/x-foo/x-foo.html')
        .expect('X-Thing', 'abc123')
        .expect('X-Stuff', 'foobar', done);
  });

  it('responds with ETag', function(done) {
    supertest(serveWaterfall(serveWaterfall.mappings.STATIC, {root: FIXTURES}))
        .get('/x-foo/x-foo.html')
        .expect('ETag', /.+/, done);
  });

  it('supports raw send options', function(done) {
    var app = serveWaterfall(serveWaterfall.mappings.STATIC, {
      root: FIXTURES,
      sendOpts: {etag: false},
    });
    supertest(app)
        .get('/x-foo/x-foo.html')
        .expect(function(response) {
          expect(response.headers.ETag).eq(undefined);
        })
        .end(done);
  });

  it('does not escape root', function(done) {
    supertest(serveWaterfall(serveWaterfall.mappings.STATIC, {root: FIXTURES}))
        .get('/../mappings.js')
        .expect(404)
        .expect('Not Found', done);
  });

  describe('with express', function() {

    var app;
    beforeEach(function() {
      app = express();
      app.use(serveWaterfall(serveWaterfall.mappings.STATIC));
    });

    it('works as expected', function(done) {
      supertest(app)
          .get('/x-foo/x-foo.html')
          .expect(200)
          .expect('x-foo\n', done);
    });

    it('falls back to additional middleware', function(done) {
      app.use(function(request, response) {
        response.end('final middleware');
      });

      supertest(app)
          .get('/not/a/thing')
          .expect('final middleware', done);
    });

    it('serves indexes', function(done) {
      supertest(serveWaterfall(serveWaterfall.mappings.STATIC, {root: FIXTURES}))
          .get('/x-foo/')
          .expect(200)
          .expect('x-foo index\n', done);
    });

    it('supports logging', function(done) {
      var messages = [];
      var app = serveWaterfall(serveWaterfall.mappings.WEB_COMPONENT, {
        root: path.join(FIXTURES, 'x-foo'),
        log:  function(message) { messages.push(message); },
      });
      supertest(app)
          .get('/components/x-fizz/x-fizz.html')
          .expect(200)
          .expect('x-fizz\n')
          .end(function() {
            expect(messages.length).to.eq(7);
            expect(messages[0]).to.match(/expanded/i);
            expect(messages[1]).to.match(/\/components\/x-foo -> .*[\/\\]fixtures[\/\\]x-foo/);
            expect(messages[2]).to.match(/\/components -> .*[\/\\]fixtures[\/\\]x-foo[\/\\]bower_components/);
            expect(messages[3]).to.match(/\/components -> .*[\/\\]fixtures/);
            expect(messages[4]).to.match(/\/ -> .*[\/\\]fixtures[\/\\]x-foo/);
            expect(messages[5]).to.match(/Tried .*[\/\\]fixtures[\/\\]x-foo[\/\\]bower_components[\/\\]x-fizz[\/\\]x-fizz.html \(404\)/i);
            expect(messages[6]).to.match(/Serving .*[\/\\]fixtures[\/\\]x-fizz[\/\\]x-fizz.html/i);
            done();
          });
    });

  });

});
