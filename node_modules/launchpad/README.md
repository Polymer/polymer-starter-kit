# Launchpad
[![Build Status](https://travis-ci.org/ekryski/launchpad.svg)](https://travis-ci.org/ekryski/launchpad)

You can launch browsers! With NodeJS!

* __Local browsers__ for MacOS, Windows and Linux (like) operating systems
* __[BrowserStack](http://browserstack.com)__ browsers using the BrowserStack API
* __Remote browsers__ using the launchpad server

## API

The general API for any launcher (`<type>`) looks like this:

```js
var launch = require('launchpad');
launch.<type>(configuration, function(error, launcher) {
  launcher.browsers(function(error, browsers) {
    // -> List of available browsers with version
  });

  launcher(url, configuration, function(error, instance) {
    instance // -> A browser instance
    instance.id // -> unique instance id
    instance.stop(callback) // -> Stop the instance
    instance.status(callback) // -> Get status information about the instance
  });

  launcher.<browsername>(url, function(error, instance) {
    // Same as above
  });
});
```

## Local launchers

Local launchers look up all currently installed browsers (unless limited by LAUNCHPAD_BROWSERS - see below for details) and allow you to start new browser processes.

```js
// Launch a local browser
launch.local(function(err, local) {
  launcher.browsers(function(error, browsers) {
    // -> List of all browsers found locally with version
  });
  
  local.firefox('http://url', function(err, instance) {
    // An instance is an event emitter
    instance.on('stop', function() {
      console.log('Terminated local firefox');
    });
  });
});
```

### Environment variables impacting local browsers detection

By default Launchpad looks up all installed browsers. To speed-up this process you can define the following env variables:
  * `LAUNCHPAD_BROWSERS` - comma delimited list of browsers you want to use, e.g. `LAUNCHPAD_BROWSERS=chrome,firefox,opera`. Other browsers will not be detected even if they are installed.
  * `LAUNCHPAD_<browser>` - specifies where given browser is installed so that Launchpad does not need to look for it, e.g.
    `LAUNCHPAD_CHROME=/usr/bin/chromium`

The following browser names are recognized: `chrome`, `firefox`, `safari`, `ie`, `opera`, `canary`, `aurora`, `phantom`, `nodeWebKit`.
Not all platforms support all browsers - see [platform](lib/local/platform) for details.

## Browserstack

BrowserStack is a great cross-browser testing tool and offers API access to any account that is on a monthly plan.
Launchpad allows you to start BrowserStack workers through its API like this:

```js
launch.browserstack({
    username : 'user',
    password : 'password'
  },
  function(err, browserstack) {
    launcher.browsers(function(error, browsers) {
      // -> List of all Browserstack browsers
    });
    
    browserstack.ie('http://url', function(err, instance) {
      // Shut the instance down after 5 seconds
      setTimeout(function() {
        instance.stop(function (err) {
          if(err) {
            console.log(err);
          }
          console.log('Browser instance has stopped');
        });
      }, 5000);
  });
});
```

Behind the scenes we have the [node-browserstack](https://github.com/scottgonzalez/node-browserstack)
module do all the work (API calls) for us.

## Remote systems

Launchpad also allows you to start browsers on other systems that are running the Launchpad server.

### The launchpad server

The launchpad server is a simple implementation of the [BrowserStack API (Version 1)](https://github.com/browserstack/api)
which provides a RESTful interface to start and stop browsers. You can set up a Launchpad server like this:

```js
launch.server({
  username : 'launcher',
  password : 'testing'
}).listen(8080, function () {
  console.log('Listeining...');
});
```

### Launching remote servers

Because the Launchpad server is compatible with the BrowserStack API (Version 1), you could basically use
any BrowserStack API client, connect to the server and start browsers.

The included remote launcher does exactly that by wrapping BrowserStack launcher and pointing it to
the given host:

```js
launch.remote({
  host : 'ie7machine',
  username : 'launcher',
  password : 'testing'
}, function(err, api) {
  launcher.browsers(function(error, browsers) {
    // -> List of all browsers found on ie7machine
  });
  
  api('http://github.com', {
    browser : 'safari',
    version : 'latest'
  }, function(err, instance) {
  });
});
```

## Changelog

__0.5.0__

- Added `LAUNCHPAD_BROWSERS` and `LAUNCHPAD_<browser>` env vars support ([#52](https://github.com/ekryski/launchpad/pull/52))

__0.4.0__

- Output PhantomJS errors and console.logs ([#35](https://github.com/ekryski/launchpad/pull/35))
- Node Webkit support for MacOS and Windows ([#30](https://github.com/ekryski/launchpad/pull/30), [#34](https://github.com/ekryski/launchpad/pull/34))
- Allow browsers to start multiple times even if they are already running ([#33](https://github.com/ekryski/launchpad/pull/33))
- Fix Windows path and add JSHint ([#32](https://github.com/ekryski/launchpad/pull/32))
- Expose `path` and `binPath` for detected browsers ([#31](https://github.com/ekryski/launchpad/pull/31))

__0.3.0__

- Major internal refactoring ([#25](https://github.com/ekryski/launchpad/pull/25))
