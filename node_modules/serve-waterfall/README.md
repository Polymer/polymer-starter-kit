[![NPM version](http://img.shields.io/npm/v/serve-waterfall.svg?style=flat-square)](https://npmjs.org/package/serve-waterfall)
[![Build Status](http://img.shields.io/travis/PolymerLabs/serve-waterfall.svg?style=flat-square)](https://travis-ci.org/PolymerLabs/serve-waterfall)

# serve-waterfall

Serves static files according to a waterfall of URL to file mappings.

Each mapping consists of a URL prefix, and a file system path that it should be mapped to. `serve-waterfall` will attempt each mapping until it finds a file that exists, which it will serve.

TL;DR:
```js
var app = express();
app.use(serveWaterfall(serveWaterfall.mappings.WEB_COMPONENT));
```

Or, provide your own mappings:

```js
var app = express();
app.use(serveWaterfall([
  {'/components/<basename>': '.'},
  {'/components': 'bower_components'},
  {'/components': '..'},
  {'/': '.'},
]));
```


## options

`serveWaterfall` accepts a second argument of options:

`root`: The directory to resolve files paths relative to.

`headers`: An object of headers to send with each request.

`sendOpts`: Additional options to pass to `send`.
