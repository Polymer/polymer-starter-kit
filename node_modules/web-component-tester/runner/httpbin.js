'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var portScanner = require('./port-scanner');

var httpbin = express.Router();

function capWords(s) {
  return s
      .split('-')
      .map(function (word) {return word[0].toUpperCase() + word.slice(1)})
      .join('-');
}

function formatRequest(req) {
  var headers = {};
  for (var key in req.headers) {
    headers[capWords(key)] = req.headers[key];
  }
  var formatted = {
    headers: headers,
    url: req.originalUrl,
    data: req.body,
    files: req.files,
    form: {},
    json: {},
  };
  var contentType = (headers['Content-Type'] || '').toLowerCase().split(';')[0];
  var field = {
      'application/json': 'json',
      'application/x-www-form-urlencoded': 'form',
      'multipart/form-data': 'form'
  }[contentType];
  if (field) {
    formatted[field] = req.body;
  }
  return formatted;
}

httpbin.use(bodyParser.urlencoded({extended: false}));
httpbin.use(bodyParser.json());
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
httpbin.use(upload.any());
httpbin.use(bodyParser.text());
httpbin.use(bodyParser.text({type: 'html'}));
httpbin.use(bodyParser.text({type: 'xml'}));

httpbin.get('/delay/:seconds', function (req, res) {
  setTimeout(function() {
    res.json(formatRequest(req));
  }, (req.params.seconds || 0) * 1000);
});

httpbin.post('/post', function (req, res) {
  res.json(formatRequest(req));
});

exports.httpbin = httpbin;

// Running this script directly with `node httpbin.js` will start up a server
// that just serves out /httpbin/...
// Useful for debugging only the httpbin functionality without the rest of
// wct.
if (require.main === module) {
  var http           = require('http');
  var serverDestroy  = require('server-destroy');
  var cleankill      = require('cleankill');

  var app = express();
  var server = http.createServer(app);

  app.use('/httpbin', httpbin);


  portScanner([7777, 7000, 8000, 8080, 8888], function(err, port) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    server.listen(port);
    server.port = port;
    serverDestroy(server);
    cleankill.onInterrupt(function(done) {
      server.destroy();
      server.on('close', done);
    });

    console.log('Server running at http://localhost:' + port + '/httpbin/');
  });
}
