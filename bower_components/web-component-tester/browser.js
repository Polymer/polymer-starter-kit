/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function () { 'use strict';

/**
 * @param {function()} callback A function to call when the active web component
 *     frameworks have loaded.
 */
function whenFrameworksReady(callback) {
  debug('whenFrameworksReady');
  var done = function() {
    debug('whenFrameworksReady done');
    callback();
  };

  function whenWebComponentsReady() {
    debug('WebComponentsReady?');
    if (window.WebComponents && WebComponents.whenReady) {
      WebComponents.whenReady(function() {
        debug('WebComponents Ready');
        done();
      });
    } else {
      var after = function after() {
        window.removeEventListener('WebComponentsReady', after);
        debug('WebComponentsReady');
        done();
      };
      window.addEventListener('WebComponentsReady', after);
    }
  }

  function importsReady() {
    // handle Polymer 0.5 readiness
    debug('Polymer ready?');
    if (window.Polymer && Polymer.whenReady) {
      Polymer.whenReady(function() {
        debug('Polymer ready');
        done();
      });
    } else {
      whenWebComponentsReady();
    }
  }

  // All our supported framework configurations depend on imports.
  if (!window.HTMLImports) {
    done();
  } else if (HTMLImports.ready) {
    debug('HTMLImports ready');
    importsReady();
  } else if (HTMLImports.whenReady) {
    HTMLImports.whenReady(function() {
      debug('HTMLImports.whenReady ready');
      importsReady();
    });
  } else {
    whenWebComponentsReady();
  }
}

/**
 * @param {number} count
 * @param {string} kind
 * @return {string} '<count> <kind> tests' or '<count> <kind> test'.
 */
function pluralizedStat(count, kind) {
  if (count === 1) {
    return count + ' ' + kind + ' test';
  } else {
    return count + ' ' + kind + ' tests';
  }
}

/**
 * @param {string} path The URI of the script to load.
 * @param {function} done
 */
function loadScript(path, done) {
  var script = document.createElement('script');
  script.src = path;
  if (done) {
    script.onload = done.bind(null, null);
    script.onerror = done.bind(null, 'Failed to load script ' + script.src);
  }
  document.head.appendChild(script);
}

/**
 * @param {string} path The URI of the stylesheet to load.
 * @param {function} done
 */
function loadStyle(path, done) {
  var link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = path;
  if (done) {
    link.onload = done.bind(null, null);
    link.onerror = done.bind(null, 'Failed to load stylesheet ' + link.href);
  }
  document.head.appendChild(link);
}

/**
 * @param {...*} var_args Logs values to the console when the `debug`
 *     configuration option is true.
 */
function debug(var_args) {
  if (!get('verbose')) return;
  var args = [window.location.pathname];
  args.push.apply(args, arguments);
  (console.debug || console.log).apply(console, args);
}

// URL Processing

/**
 * @param {string} url
 * @return {{base: string, params: string}}
 */
function parseUrl(url) {
  var parts = url.match(/^(.*?)(?:\?(.*))?$/);
  return {
    base:   parts[1],
    params: getParams(parts[2] || ''),
  };
}

/**
 * Expands a URL that may or may not be relative to `base`.
 *
 * @param {string} url
 * @param {string} base
 * @return {string}
 */
function expandUrl(url, base) {
  if (!base) return url;
  if (url.match(/^(\/|https?:\/\/)/)) return url;
  if (base.substr(base.length - 1) !== '/') {
    base = base + '/';
  }
  return base + url;
}

/**
 * @param {string=} opt_query A query string to parse.
 * @return {!Object<string, !Array<string>>} All params on the URL's query.
 */
function getParams(opt_query) {
  var query = typeof opt_query === 'string' ? opt_query : window.location.search;
  if (query.substring(0, 1) === '?') {
    query = query.substring(1);
  }
  // python's SimpleHTTPServer tacks a `/` on the end of query strings :(
  if (query.slice(-1) === '/') {
    query = query.substring(0, query.length - 1);
  }
  if (query === '') return {};

  var result = {};
  query.split('&').forEach(function(part) {
    var pair = part.split('=');
    if (pair.length !== 2) {
      console.warn('Invalid URL query part:', part);
      return;
    }
    var key   = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);

    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(value);
  });

  return result;
}

/**
 * Merges params from `source` into `target` (mutating `target`).
 *
 * @param {!Object<string, !Array<string>>} target
 * @param {!Object<string, !Array<string>>} source
 */
function mergeParams(target, source) {
  Object.keys(source).forEach(function(key) {
    if (!(key in target)) {
      target[key] = [];
    }
    target[key] = target[key].concat(source[key]);
  });
}

/**
 * @param {string} param The param to return a value for.
 * @return {?string} The first value for `param`, if found.
 */
function getParam(param) {
  var params = getParams();
  return params[param] ? params[param][0] : null;
}

/**
 * @param {!Object<string, !Array<string>>} params
 * @return {string} `params` encoded as a URI query.
 */
function paramsToQuery(params) {
  var pairs = [];
  Object.keys(params).forEach(function(key) {
    params[key].forEach(function(value) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
  });
  return (pairs.length > 0) ? ('?' + pairs.join('&')) : '';
}

/**
 * @param {!Location|string} location
 * @return {string}
 */
function basePath(location) {
  return (location.pathname || location).match(/^.*\//)[0];
}

/**
 * @param {!Location|string} location
 * @param {string} basePath
 * @return {string}
 */
function relativeLocation(location, basePath) {
  var path = location.pathname || location;
  if (path.indexOf(basePath) === 0) {
    path = path.substring(basePath.length);
  }
  return path;
}

/**
 * @param {!Location|string} location
 * @return {string}
 */
function cleanLocation(location) {
  var path = location.pathname || location;
  if (path.slice(-11) === '/index.html') {
    path = path.slice(0, path.length - 10);
  }
  return path;
}

/**
 * Like `async.parallelLimit`, but our own so that we don't force a dependency
 * on downstream code.
 *
 * @param {!Array<function(function(*))>} runners Runners that call their given
 *     Node-style callback when done.
 * @param {number|function(*)} limit Maximum number of concurrent runners.
 *     (optional).
 * @param {?function(*)} done Callback that should be triggered once all runners
 *     have completed, or encountered an error.
 */
function parallel(runners, limit, done) {
  if (typeof limit !== 'number') {
    done  = limit;
    limit = 0;
  }
  if (!runners.length) return done();

  var called    = false;
  var total     = runners.length;
  var numActive = 0;
  var numDone   = 0;

  function runnerDone(error) {
    if (called) return;
    numDone = numDone + 1;
    numActive = numActive - 1;

    if (error || numDone >= total) {
      called = true;
      done(error);
    } else {
      runOne();
    }
  }

  function runOne() {
    if (limit && numActive >= limit) return;
    if (!runners.length) return;
    numActive = numActive + 1;
    runners.shift()(runnerDone);
  }
  runners.forEach(runOne);
}

/**
 * Finds the directory that a loaded script is hosted on.
 *
 * @param {string} filename
 * @return {string?}
 */
function scriptPrefix(filename) {
  var scripts = document.querySelectorAll('script[src*="' + filename + '"]');
  if (scripts.length !== 1) return null;
  var script = scripts[0].src;
  return script.substring(0, script.indexOf(filename));
}


var util = Object.freeze({
  whenFrameworksReady: whenFrameworksReady,
  pluralizedStat: pluralizedStat,
  loadScript: loadScript,
  loadStyle: loadStyle,
  debug: debug,
  parseUrl: parseUrl,
  expandUrl: expandUrl,
  getParams: getParams,
  mergeParams: mergeParams,
  getParam: getParam,
  paramsToQuery: paramsToQuery,
  basePath: basePath,
  relativeLocation: relativeLocation,
  cleanLocation: cleanLocation,
  parallel: parallel,
  scriptPrefix: scriptPrefix
});

// TODO(thedeeno): Consider renaming subsuite. IIRC, childRunner is entirely
// distinct from mocha suite, which tripped me up badly when trying to add
// plugin support. Perhaps something like 'batch', or 'bundle'. Something that
// has no mocha correlate. This may also eliminate the need for root/non-root
// suite distinctions.

/**
 * A Mocha suite (or suites) run within a child iframe, but reported as if they
 * are part of the current context.
 */
function ChildRunner(url, parentScope) {
  var urlBits = parseUrl(url);
  mergeParams(
      urlBits.params, getParams(parentScope.location.search));
  delete urlBits.params.cli_browser_id;

  this.url         = urlBits.base + paramsToQuery(urlBits.params);
  this.parentScope = parentScope;

  this.state = 'initializing';
}

// ChildRunners get a pretty generous load timeout by default.
ChildRunner.loadTimeout = 60000;

// We can't maintain properties on iframe elements in Firefox/Safari/???, so we
// track childRunners by URL.
ChildRunner._byUrl = {};

/**
 * @return {ChildRunner} The `ChildRunner` that was registered for this window.
 */
ChildRunner.current = function() {
  return ChildRunner.get(window);
};

/**
 * @param {!Window} target A window to find the ChildRunner of.
 * @param {boolean} traversal Whether this is a traversal from a child window.
 * @return {ChildRunner} The `ChildRunner` that was registered for `target`.
 */
ChildRunner.get = function(target, traversal) {
  var childRunner = ChildRunner._byUrl[target.location.href];
  if (childRunner) return childRunner;
  if (window.parent === window) {  // Top window.
    if (traversal) {
      console.warn('Subsuite loaded but was never registered. This most likely is due to wonky history behavior. Reloading...');
      window.location.reload();
    }
    return null;
  }
  // Otherwise, traverse.
  return window.parent.WCT._ChildRunner.get(target, true);
};

/**
 * Loads and runs the subsuite.
 *
 * @param {function} done Node-style callback.
 */
ChildRunner.prototype.run = function(done) {
  debug('ChildRunner#run', this.url);
  this.state = 'loading';
  this.onRunComplete = done;

  this.iframe = document.createElement('iframe');
  this.iframe.src = this.url;
  this.iframe.classList.add('subsuite');

  var container = document.getElementById('subsuites');
  if (!container) {
    container = document.createElement('div');
    container.id = 'subsuites';
    document.body.appendChild(container);
  }
  container.appendChild(this.iframe);

  // let the iframe expand the URL for us.
  this.url = this.iframe.src;
  ChildRunner._byUrl[this.url] = this;

  this.timeoutId = setTimeout(
      this.loaded.bind(this, new Error('Timed out loading ' + this.url)), ChildRunner.loadTimeout);

  this.iframe.addEventListener('error',
      this.loaded.bind(this, new Error('Failed to load document ' + this.url)));

  this.iframe.contentWindow.addEventListener('DOMContentLoaded', this.loaded.bind(this, null));
};

/**
 * Called when the sub suite's iframe has loaded (or errored during load).
 *
 * @param {*} error The error that occured, if any.
 */
ChildRunner.prototype.loaded = function(error) {
  debug('ChildRunner#loaded', this.url, error);

  // Not all targets have WCT loaded (compatiblity mode)
  if (this.iframe.contentWindow.WCT) {
    this.share = this.iframe.contentWindow.WCT.share;
  }

  if (error) {
    this.signalRunComplete(error);
    this.done();
  }
};

/**
 * Called in mocha/run.js when all dependencies have loaded, and the child is
 * ready to start running tests
 *
 * @param {*} error The error that occured, if any.
 */
ChildRunner.prototype.ready = function(error) {
  debug('ChildRunner#ready', this.url, error);
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
  if (error) {
    this.signalRunComplete(error);
    this.done();
  }
};

/** Called when the sub suite's tests are complete, so that it can clean up. */
ChildRunner.prototype.done = function done() {
  debug('ChildRunner#done', this.url, arguments);

  // make sure to clear that timeout
  this.ready();
  this.signalRunComplete();

  if (!this.iframe) return;
  // Be safe and avoid potential browser crashes when logic attempts to interact
  // with the removed iframe.
  setTimeout(function() {
    this.iframe.parentNode.removeChild(this.iframe);
    this.iframe = null;
  }.bind(this), 1);
};

ChildRunner.prototype.signalRunComplete = function signalRunComplete(error) {
  if (!this.onRunComplete) return;
  this.state = 'complete';
  this.onRunComplete(error);
  this.onRunComplete = null;
};

/**
 * The global configuration state for WCT's browser client.
 */
var _config = {
  /**
   * `.js` scripts to be loaded (synchronously) before WCT starts in earnest.
   *
   * Paths are relative to `scriptPrefix`.
   */
  environmentScripts: [
    'stacky/browser.js',
    'async/lib/async.js',
    'lodash/lodash.js',
    'mocha/mocha.js',
    'chai/chai.js',
    'sinonjs/sinon.js',
    'sinon-chai/lib/sinon-chai.js',
    'accessibility-developer-tools/dist/js/axs_testing.js'
  ],

  environmentImports: [
    'test-fixture/test-fixture.html'
  ],

  /** Absolute root for client scripts. Detected in `setup()` if not set. */
  root: null,

  /** By default, we wait for any web component frameworks to load. */
  waitForFrameworks: true,

  /** Alternate callback for waiting for tests.
   * `this` for the callback will be the window currently running tests.
   */
  waitFor: null,

  /** How many `.html` suites that can be concurrently loaded & run. */
  numConcurrentSuites: 1,

  /** Whether `console.error` should be treated as a test failure. */
  trackConsoleError: true,

  /** Configuration passed to mocha.setup. */
  mochaOptions: {
    timeout: 10 * 1000
  },

  /** Whether WCT should emit (extremely verbose) debugging log messages. */
  verbose: false,
};

/**
 * Merges initial `options` into WCT's global configuration.
 *
 * @param {Object} options The options to merge. See `browser/config.js` for a
 *     reference.
 */
function setup(options) {
  var childRunner = ChildRunner.current();
  if (childRunner) {
    _deepMerge(_config, childRunner.parentScope.WCT._config);
    // But do not force the mocha UI
    delete _config.mochaOptions.ui;
  }

  if (options && typeof options === 'object') {
    _deepMerge(_config, options);
  }

  if (!_config.root) {
    // Sibling dependencies.
    var root = scriptPrefix('browser.js');
    _config.root = basePath(root.substr(0, root.length - 1));
    if (!_config.root) {
      throw new Error('Unable to detect root URL for WCT sources. Please set WCT.root before including browser.js');
    }
  }
}

/**
 * Retrieves a configuration value.
 *
 * @param {string} key
 * @return {*}
 */
function get(key) {
  return _config[key];
}

// Internal

function _deepMerge(target, source) {
  Object.keys(source).forEach(function(key) {
    if (target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])) {
      _deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });
}

var htmlSuites$1 = [];
var jsSuites$1   = [];

// We process grep ourselves to avoid loading suites that will be filtered.
var GREP = getParam('grep');

/**
 * Loads suites of tests, supporting both `.js` and `.html` files.
 *
 * @param {!Array.<string>} files The files to load.
 */
function loadSuites(files) {
  files.forEach(function(file) {
    if (/\.js(\?.*)?$/.test(file)) {
      jsSuites$1.push(file);
    } else if (/\.html(\?.*)?$/.test(file)) {
      htmlSuites$1.push(file);
    } else {
      throw new Error('Unknown resource type: ' + file);
    }
  });
}

/**
 * @return {!Array.<string>} The child suites that should be loaded, ignoring
 *     those that would not match `GREP`.
 */
function activeChildSuites() {
  var subsuites = htmlSuites$1;
  if (GREP) {
    var cleanSubsuites = [];
    for (var i = 0, subsuite; subsuite = subsuites[i]; i++) {
      if (GREP.indexOf(cleanLocation(subsuite)) !== -1) {
        cleanSubsuites.push(subsuite);
      }
    }
    subsuites = cleanSubsuites;
  }
  return subsuites;
}

/**
 * Loads all `.js` sources requested by the current suite.
 *
 * @param {!MultiReporter} reporter
 * @param {function} done
 */
function loadJsSuites(reporter, done) {
  debug('loadJsSuites', jsSuites$1);

  var loaders = jsSuites$1.map(function(file) {
    // We only support `.js` dependencies for now.
    return loadScript.bind(util, file);
  });

  parallel(loaders, done);
}

/**
 * @param {!MultiReporter} reporter
 * @param {!Array.<string>} childSuites
 * @param {function} done
 */
function runSuites(reporter, childSuites, done) {
  debug('runSuites');

  var suiteRunners = [
    // Run the local tests (if any) first, not stopping on error;
    _runMocha.bind(null, reporter),
  ];

  // As well as any sub suites. Again, don't stop on error.
  childSuites.forEach(function(file) {
    suiteRunners.push(function(next) {
      var childRunner = new ChildRunner(file, window);
      reporter.emit('childRunner start', childRunner);
      childRunner.run(function(error) {
        reporter.emit('childRunner end', childRunner);
        if (error) reporter.emitOutOfBandTest(file, error);
        next();
      });
    });
  });

  parallel(suiteRunners, get('numConcurrentSuites'), function(error) {
    reporter.done();
    done(error);
  });
}

/**
 * Kicks off a mocha run, waiting for frameworks to load if necessary.
 *
 * @param {!MultiReporter} reporter Where to send Mocha's events.
 * @param {function} done A callback fired, _no error is passed_.
 */
function _runMocha(reporter, done, waited) {
  if (get('waitForFrameworks') && !waited) {
    var waitFor = (get('waitFor') || whenFrameworksReady).bind(window);
    waitFor(_runMocha.bind(null, reporter, done, true));
    return;
  }
  debug('_runMocha');
  var mocha = window.mocha;
  var Mocha = window.Mocha;

  mocha.reporter(reporter.childReporter(window.location));
  mocha.suite.title = reporter.suiteTitle(window.location);
  mocha.grep(GREP);

  // We can't use `mocha.run` because it bashes over grep, invert, and friends.
  // See https://github.com/visionmedia/mocha/blob/master/support/tail.js#L137
  var runner = Mocha.prototype.run.call(mocha, function(error) {
    if (document.getElementById('mocha')) {
      Mocha.utils.highlightTags('code');
    }
    done();  // We ignore the Mocha failure count.
  });

  // Mocha's default `onerror` handling strips the stack (to support really old
  // browsers). We upgrade this to get better stacks for async errors.
  //
  // TODO(nevir): Can we expand support to other browsers?
  if (navigator.userAgent.match(/chrome/i)) {
    window.onerror = null;
    window.addEventListener('error', function(event) {
      if (!event.error) return;
      if (event.error.ignore) return;
      runner.uncaught(event.error);
    });
  }
}

// We may encounter errors during initialization (for example, syntax errors in
// a test file). Hang onto those (and more) until we are ready to report them.
var globalErrors = [];

/**
 * Hook the environment to pick up on global errors.
 */
function listenForErrors() {
  window.addEventListener('error', function(event) {
    globalErrors.push(event.error);
  });

  // Also, we treat `console.error` as a test failure. Unless you prefer not.
  var origConsole = console;
  var origError   = console.error;
  console.error = function wctShimmedError() {
    origError.apply(origConsole, arguments);
    if (get('trackConsoleError')) {
      throw 'console.error: ' + Array.prototype.join.call(arguments, ' ');
    }
  };
}

var interfaceExtensions = [];

/**
 * Registers an extension that extends the global `Mocha` implementation
 * with new helper methods. These helper methods will be added to the `window`
 * when tests run for both BDD and TDD interfaces.
 */
function extendInterfaces(helperName, helperFactory) {
  interfaceExtensions.push(function() {
    var Mocha = window.Mocha;
    // For all Mocha interfaces (probably just TDD and BDD):
    Object.keys(Mocha.interfaces).forEach(function(interfaceName) {
      // This is the original callback that defines the interface (TDD or BDD):
      var originalInterface = Mocha.interfaces[interfaceName];
      // This is the name of the "teardown" or "afterEach" property for the
      // current interface:
      var teardownProperty = interfaceName === 'tdd' ? 'teardown' : 'afterEach';
      // The original callback is monkey patched with a new one that appends to
      // the global context however we want it to:
      Mocha.interfaces[interfaceName] = function(suite) {
        // Call back to the original callback so that we get the base interface:
        originalInterface.apply(this, arguments);
        // Register a listener so that we can further extend the base interface:
        suite.on('pre-require', function(context, file, mocha) {
          // Capture a bound reference to the teardown function as a convenience:
          var teardown = context[teardownProperty].bind(context);
          // Add our new helper to the testing context. The helper is generated
          // by a factory method that receives the context, the teardown function
          // and the interface name and returns the new method to be added to
          // that context:
          context[helperName] = helperFactory(context, teardown, interfaceName);
        });
      };
    });
  });
}

/**
 * Applies any registered interface extensions. The extensions will be applied
 * as many times as this function is called, so don't call it more than once.
 */
function applyExtensions() {
  interfaceExtensions.forEach(function(applyExtension) {
    applyExtension();
  });
}

extendInterfaces('fixture', function(context, teardown) {

  // Return context.fixture if it is already a thing, for backwards
  // compatibility with `test-fixture-mocha.js`:
  return context.fixture || function fixture(fixtureId, model) {

    // Automatically register a teardown callback that will restore the
    // test-fixture:
    teardown(function() {
      document.getElementById(fixtureId).restore();
    });

    // Find the test-fixture with the provided ID and create it, returning
    // the results:
    return document.getElementById(fixtureId).create(model);
  };
});

/**
 * stub
 *
 * The stub addon allows the tester to partially replace the implementation of
 * an element with some custom implementation. Usage example:
 *
 * beforeEach(function() {
 *   stub('x-foo', {
 *     attached: function() {
 *       // Custom implementation of the `attached` method of element `x-foo`..
 *     },
 *     otherMethod: function() {
 *       // More custom implementation..
 *     },
 *     // etc..
 *   });
 * });
 */
extendInterfaces('stub', function(context, teardown) {

  return function stub(tagName, implementation) {
    // Find the prototype of the element being stubbed:
    var proto = document.createElement(tagName).constructor.prototype;

    // For all keys in the implementation to stub with..
    var keys = Object.keys(implementation);
    keys.forEach(function(key) {
      // Stub the method on the element prototype with Sinon:
      sinon.stub(proto, key, implementation[key]);
    });

    // After all tests..
    teardown(function() {
      // For all of the keys in the implementation we stubbed..
      keys.forEach(function(key) {
        // Restore the stub:
        if (proto[key].isSinonProxy) {
          proto[key].restore();
        }
      });
    });
  };
});

/**
 * replace
 *
 * The replace addon allows the tester to replace all usages of one element with
 * another element within all Polymer elements created within the time span of
 * the test. Usage example:
 *
 * beforeEach(function() {
 *   replace('x-foo').with('x-fake-foo');
 * });
 *
 * All annotations and attributes will be set on the placement element the way
 * they were set for the original element.
 */
extendInterfaces('replace', function(context, teardown) {
  return function replace(oldTagName) {
    return {
      with: function(tagName) {
        // Keep a reference to the original `Polymer.Base.instanceTemplate`
        // implementation for later:
        var originalInstanceTemplate = Polymer.Base.instanceTemplate;

        // Use Sinon to stub `Polymer.Base.instanceTemplate`:
        sinon.stub(Polymer.Base, 'instanceTemplate', function(template) {
          // The DOM to replace is the result of calling the "original"
          // `instanceTemplate` implementation:
          var dom = originalInstanceTemplate.apply(this, arguments);

          // The nodes to replace are queried from the DOM chunk:
          var nodes = Array.prototype.slice.call(dom.querySelectorAll(oldTagName));

          // For all of the nodes we want to place...
          nodes.forEach(function(node) {

            // Create a replacement:
            var replacement = document.createElement(tagName);

            // For all attributes in the original node..
            for (var index = 0; index < node.attributes.length; ++index) {
              // Set that attribute on the replacement:
              replacement.setAttribute(
                node.attributes[index].name, node.attributes[index].value);
            }

            // Replace the original node with the replacement node:
            node.parentNode.replaceChild(replacement, node);
          });

          return dom;
        });

        // After each test...
        teardown(function() {
          // Restore the stubbed version of `Polymer.Base.instanceTemplate`:
          if (Polymer.Base.instanceTemplate.isSinonProxy) {
            Polymer.Base.instanceTemplate.restore();
          }
        });
      }
    };
  };
});

// Mocha global helpers, broken out by testing method.
//
// Keys are the method for a particular interface; values are their analog in
// the opposite interface.
var MOCHA_EXPORTS = {
  // https://github.com/visionmedia/mocha/blob/master/lib/interfaces/tdd.js
  tdd: {
    'setup':         '"before"',
    'teardown':      '"after"',
    'suiteSetup':    '"beforeEach"',
    'suiteTeardown': '"afterEach"',
    'suite':         '"describe" or "context"',
    'test':          '"it" or "specify"',
  },
  // https://github.com/visionmedia/mocha/blob/master/lib/interfaces/bdd.js
  bdd: {
    'before':     '"setup"',
    'after':      '"teardown"',
    'beforeEach': '"suiteSetup"',
    'afterEach':  '"suiteTeardown"',
    'describe':   '"suite"',
    'context':    '"suite"',
    'xdescribe':  '"suite.skip"',
    'xcontext':   '"suite.skip"',
    'it':         '"test"',
    'xit':        '"test.skip"',
    'specify':    '"test"',
    'xspecify':   '"test.skip"',
  },
};

/**
 * Exposes all Mocha methods up front, configuring and running mocha
 * automatically when you call them.
 *
 * The assumption is that it is a one-off (sub-)suite of tests being run.
 */
function stubInterfaces() {
  Object.keys(MOCHA_EXPORTS).forEach(function(ui) {
    Object.keys(MOCHA_EXPORTS[ui]).forEach(function(key) {
      window[key] = function wrappedMochaFunction() {
        _setupMocha(ui, key, MOCHA_EXPORTS[ui][key]);
        if (!window[key] || window[key] === wrappedMochaFunction) {
          throw new Error('Expected mocha.setup to define ' + key);
        }
        window[key].apply(window, arguments);
      };
    });
  });
}

// Whether we've called `mocha.setup`
var _mochaIsSetup = false;

/**
 * @param {string} ui Sets up mocha to run `ui`-style tests.
 * @param {string} key The method called that triggered this.
 * @param {string} alternate The matching method in the opposite interface.
 */
function _setupMocha(ui, key, alternate) {
  var mochaOptions = get('mochaOptions');
  if (mochaOptions.ui && mochaOptions.ui !== ui) {
    var message = 'Mixing ' + mochaOptions.ui + ' and ' + ui + ' Mocha styles is not supported. ' +
                  'You called "' + key + '". Did you mean ' + alternate + '?';
    throw new Error(message);
  }
  if (_mochaIsSetup) return;

  applyExtensions();
  mochaOptions.ui = ui;
  mocha.setup(mochaOptions);  // Note that the reporter is configured in run.js.
}

// We capture console events when running tests; so make sure we have a
// reference to the original one.
var console$1 = window.console;

var FONT = ';font: normal 13px "Roboto", "Helvetica Neue", "Helvetica", sans-serif;';
var STYLES = {
  plain:   FONT,
  suite:   'color: #5c6bc0' + FONT,
  test:    FONT,
  passing: 'color: #259b24' + FONT,
  pending: 'color: #e65100' + FONT,
  failing: 'color: #c41411' + FONT,
  stack:   'color: #c41411',
  results: FONT + 'font-size: 16px',
};

// I don't think we can feature detect this one...
var userAgent = navigator.userAgent.toLowerCase();
var CAN_STYLE_LOG   = userAgent.match('firefox') || userAgent.match('webkit');
var CAN_STYLE_GROUP = userAgent.match('webkit');
// Track the indent for faked `console.group`
var logIndent = '';

function log(text, style) {
  text = text.split('\n').map(function(l) { return logIndent + l; }).join('\n');
  if (CAN_STYLE_LOG) {
    console$1.log('%c' + text, STYLES[style] || STYLES.plain);
  } else {
    console$1.log(text);
  }
}

function logGroup(text, style) {
  if (CAN_STYLE_GROUP) {
    console$1.group('%c' + text, STYLES[style] || STYLES.plain);
  } else if (console$1.group) {
    console$1.group(text);
  } else {
    logIndent = logIndent + '  ';
    log(text, style);
  }
}

function logGroupEnd() {
  if (console$1.groupEnd) {
    console$1.groupEnd();
  } else {
    logIndent = logIndent.substr(0, logIndent.length - 2);
  }
}

function logException(error) {
  log(error.stack || error.message || error, 'stack');
}

/**
 * A Mocha reporter that logs results out to the web `console`.
 *
 * @param {!Mocha.Runner} runner The runner that is being reported on.
 */
function Console(runner) {
  Mocha.reporters.Base.call(this, runner);

  runner.on('suite', function(suite) {
    if (suite.root) return;
    logGroup(suite.title, 'suite');
  }.bind(this));

  runner.on('suite end', function(suite) {
    if (suite.root) return;
    logGroupEnd();
  }.bind(this));

  runner.on('test', function(test) {
    logGroup(test.title, 'test');
  }.bind(this));

  runner.on('pending', function(test) {
    logGroup(test.title, 'pending');
  }.bind(this));

  runner.on('fail', function(test, error) {
    logException(error);
  }.bind(this));

  runner.on('test end', function(test) {
    logGroupEnd();
  }.bind(this));

  runner.on('end', this.logSummary.bind(this));
}

/** Prints out a final summary of test results. */
Console.prototype.logSummary = function logSummary() {
  logGroup('Test Results', 'results');

  if (this.stats.failures > 0) {
    log(pluralizedStat(this.stats.failures, 'failing'), 'failing');
  }
  if (this.stats.pending > 0) {
    log(pluralizedStat(this.stats.pending, 'pending'), 'pending');
  }
  log(pluralizedStat(this.stats.passes, 'passing'));

  if (!this.stats.failures) {
    log('test suite passed', 'passing');
  }
  log('Evaluated ' + this.stats.tests + ' tests in ' + this.stats.duration + 'ms.');
  logGroupEnd();
};

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * WCT-specific behavior on top of Mocha's default HTML reporter.
 *
 * @param {!Mocha.Runner} runner The runner that is being reported on.
 */
function HTML(runner) {
  var output = document.createElement('div');
  output.id = 'mocha';
  document.body.appendChild(output);

  runner.on('suite', function(test) {
    this.total = runner.total;
  }.bind(this));

  Mocha.reporters.HTML.call(this, runner);
}

// Woo! What a hack. This just saves us from adding a bunch of complexity around
// style loading.
var style = document.createElement('style');
style.textContent = 'html, body {' +
                    '  position: relative;' +
                    '  height: 100%;' +
                    '  width:  100%;' +
                    '  min-width: 900px;' +
                    '}' +
                    '#mocha, #subsuites {' +
                    '  height: 100%;' +
                    '  position: absolute;' +
                    '  top: 0;' +
                    '}' +
                    '#mocha {' +
                    '  box-sizing: border-box;' +
                    '  margin: 0 !important;' +
                    '  overflow-y: auto;' +
                    '  padding: 60px 20px;' +
                    '  right: 0;' +
                    '  left: 500px;' +
                    '}' +
                    '#subsuites {' +
                    '  -ms-flex-direction: column;' +
                    '  -webkit-flex-direction: column;' +
                    '  display: -ms-flexbox;' +
                    '  display: -webkit-flex;' +
                    '  display: flex;' +
                    '  flex-direction: column;' +
                    '  left: 0;' +
                    '  width: 500px;' +
                    '}' +
                    '#subsuites .subsuite {' +
                    '  border: 0;' +
                    '  width: 100%;' +
                    '  height: 100%;' +
                    '}' +
                    '#mocha .test.pass .duration {' +
                    '  color: #555 !important;' +
                    '}';
document.head.appendChild(style);

var STACKY_CONFIG = {
  indent: '  ',
  locationStrip: [
    /^https?:\/\/[^\/]+/,
    /\?.*$/,
  ],
  filter: function(line) {
    return line.location.match(/\/web-component-tester\/[^\/]+(\?.*)?$/);
  },
};

// https://github.com/visionmedia/mocha/blob/master/lib/runner.js#L36-46
var MOCHA_EVENTS = [
  'start',
  'end',
  'suite',
  'suite end',
  'test',
  'test end',
  'hook',
  'hook end',
  'pass',
  'fail',
  'pending',
  'childRunner end'
];

// Until a suite has loaded, we assume this many tests in it.
var ESTIMATED_TESTS_PER_SUITE = 3;

/**
 * A Mocha-like reporter that combines the output of multiple Mocha suites.
 *
 * @param {number} numSuites The number of suites that will be run, in order to
 *     estimate the total number of tests that will be performed.
 * @param {!Array.<!Mocha.reporters.Base>} reporters The set of reporters that
 *     should receive the unified event stream.
 * @param {MultiReporter} parent The parent reporter, if present.
 */
function MultiReporter(numSuites, reporters, parent) {
  this.reporters = reporters.map(function(reporter) {
    return new reporter(this);
  }.bind(this));

  this.parent = parent;
  this.basePath = parent && parent.basePath || basePath(window.location);

  this.total = numSuites * ESTIMATED_TESTS_PER_SUITE;
  // Mocha reporters assume a stream of events, so we have to be careful to only
  // report on one runner at a time...
  this.currentRunner = null;
  // ...while we buffer events for any other active runners.
  this.pendingEvents = [];

  this.emit('start');
}

/**
 * @param {!Location|string} location The location this reporter represents.
 * @return {!Mocha.reporters.Base} A reporter-like "class" for each child suite
 *     that should be passed to `mocha.run`.
 */
MultiReporter.prototype.childReporter = function childReporter(location) {
  var name = this.suiteTitle(location);
  // The reporter is used as a constructor, so we can't depend on `this` being
  // properly bound.
  var self = this;
  function reporter(runner) {
    runner.name = name;
    self.bindChildRunner(runner);
  }
  reporter.title = name;
  return reporter;
};

/** Must be called once all runners have finished. */
MultiReporter.prototype.done = function done() {
  this.complete = true;
  this.flushPendingEvents();
  this.emit('end');
};

/**
 * Emit a top level test that is not part of any suite managed by this reporter.
 *
 * Helpful for reporting on global errors, loading issues, etc.
 *
 * @param {string} title The title of the test.
 * @param {*} opt_error An error associated with this test. If falsy, test is
 *     considered to be passing.
 * @param {string} opt_suiteTitle Title for the suite that's wrapping the test.
 * @param {?boolean} opt_estimated If this test was included in the original
 *     estimate of `numSuites`.
 */
MultiReporter.prototype.emitOutOfBandTest = function emitOutOfBandTest(title, opt_error, opt_suiteTitle, opt_estimated) {
  debug('MultiReporter#emitOutOfBandTest(', arguments, ')');
  var root = new Mocha.Suite();
  root.title = opt_suiteTitle || '';
  var test = new Mocha.Test(title, function() {
  });
  test.parent = root;
  test.state  = opt_error ? 'failed' : 'passed';
  test.err    = opt_error;

  if (!opt_estimated) {
    this.total = this.total + ESTIMATED_TESTS_PER_SUITE;
  }

  var runner = {total: 1};
  this.proxyEvent('start', runner);
  this.proxyEvent('suite', runner, root);
  this.proxyEvent('test', runner, test);
  if (opt_error) {
    this.proxyEvent('fail', runner, test, opt_error);
  } else {
    this.proxyEvent('pass', runner, test);
  }
  this.proxyEvent('test end', runner, test);
  this.proxyEvent('suite end', runner, root);
  this.proxyEvent('end', runner);
};

/**
 * @param {!Location|string} location
 * @return {string}
 */
MultiReporter.prototype.suiteTitle = function suiteTitle(location) {
  var path = relativeLocation(location, this.basePath);
  path = cleanLocation(path);
  return path;
};

// Internal Interface

/** @param {!Mocha.runners.Base} runner The runner to listen to events for. */
MultiReporter.prototype.bindChildRunner = function bindChildRunner(runner) {
  MOCHA_EVENTS.forEach(function(eventName) {
    runner.on(eventName, this.proxyEvent.bind(this, eventName, runner));
  }.bind(this));
};

/**
 * Evaluates an event fired by `runner`, proxying it forward or buffering it.
 *
 * @param {string} eventName
 * @param {!Mocha.runners.Base} runner The runner that emitted this event.
 * @param {...*} var_args Any additional data passed as part of the event.
 */
MultiReporter.prototype.proxyEvent = function proxyEvent(eventName, runner, var_args) {
  var extraArgs = Array.prototype.slice.call(arguments, 2);
  if (this.complete) {
    console.warn('out of order Mocha event for ' + runner.name + ':', eventName, extraArgs);
    return;
  }

  if (this.currentRunner && runner !== this.currentRunner) {
    this.pendingEvents.push(arguments);
    return;
  }
  debug('MultiReporter#proxyEvent(', arguments, ')');

  // This appears to be a Mocha bug: Tests failed by passing an error to their
  // done function don't set `err` properly.
  //
  // TODO(nevir): Track down.
  if (eventName === 'fail' && !extraArgs[0].err) {
    extraArgs[0].err = extraArgs[1];
  }

  if (eventName === 'start') {
    this.onRunnerStart(runner);
  } else if (eventName === 'end') {
    this.onRunnerEnd(runner);
  } else {
    this.cleanEvent(eventName, runner, extraArgs);
    this.emit.apply(this, [eventName].concat(extraArgs));
  }
};

/**
 * Cleans or modifies an event if needed.
 *
 * @param {string} eventName
 * @param {!Mocha.runners.Base} runner The runner that emitted this event.
 * @param {!Array.<*>} extraArgs
 */
MultiReporter.prototype.cleanEvent = function cleanEvent(eventName, runner, extraArgs) {
  // Suite hierarchy
  if (extraArgs[0]) {
    extraArgs[0] = this.showRootSuite(extraArgs[0]);
  }

  // Normalize errors
  if (eventName === 'fail') {
    extraArgs[1] = Stacky.normalize(extraArgs[1], STACKY_CONFIG);
  }
  if (extraArgs[0] && extraArgs[0].err) {
    extraArgs[0].err = Stacky.normalize(extraArgs[0].err, STACKY_CONFIG);
  }
};

/**
 * We like to show the root suite's title, which requires a little bit of
 * trickery in the suite hierarchy.
 *
 * @param {!Mocha.Runnable} node
 */
MultiReporter.prototype.showRootSuite = function showRootSuite(node) {
  var leaf = node = Object.create(node);
  while (node && node.parent) {
    var wrappedParent = Object.create(node.parent);
    node.parent = wrappedParent;
    node = wrappedParent;
  }
  node.root = false;

  return leaf;
};

/** @param {!Mocha.runners.Base} runner */
MultiReporter.prototype.onRunnerStart = function onRunnerStart(runner) {
  debug('MultiReporter#onRunnerStart:', runner.name);
  this.total = this.total - ESTIMATED_TESTS_PER_SUITE + runner.total;
  this.currentRunner = runner;
};

/** @param {!Mocha.runners.Base} runner */
MultiReporter.prototype.onRunnerEnd = function onRunnerEnd(runner) {
  debug('MultiReporter#onRunnerEnd:', runner.name);
  this.currentRunner = null;
  this.flushPendingEvents();
};

/**
 * Flushes any buffered events and runs them through `proxyEvent`. This will
 * loop until all buffered runners are complete, or we have run out of buffered
 * events.
 */
MultiReporter.prototype.flushPendingEvents = function flushPendingEvents() {
  var events = this.pendingEvents;
  this.pendingEvents = [];
  events.forEach(function(eventArgs) {
    this.proxyEvent.apply(this, eventArgs);
  }.bind(this));
};

var ARC_OFFSET = 0; // start at the right.
var ARC_WIDTH  = 6;

/**
 * A Mocha reporter that updates the document's title and favicon with
 * at-a-glance stats.
 *
 * @param {!Mocha.Runner} runner The runner that is being reported on.
 */
function Title(runner) {
  Mocha.reporters.Base.call(this, runner);

  runner.on('test end', this.report.bind(this));
}

/** Reports current stats via the page title and favicon. */
Title.prototype.report = function report() {
  this.updateTitle();
  this.updateFavicon();
};

/** Updates the document title with a summary of current stats. */
Title.prototype.updateTitle = function updateTitle() {
  if (this.stats.failures > 0) {
    document.title = pluralizedStat(this.stats.failures, 'failing');
  } else {
    document.title = pluralizedStat(this.stats.passes, 'passing');
  }
};

/**
 * Draws an arc for the favicon status, relative to the total number of tests.
 *
 * @param {!CanvasRenderingContext2D} context
 * @param {number} total
 * @param {number} start
 * @param {number} length
 * @param {string} color
 */
function drawFaviconArc(context, total, start, length, color) {
  var arcStart = ARC_OFFSET + Math.PI * 2 * (start / total);
  var arcEnd   = ARC_OFFSET + Math.PI * 2 * ((start + length) / total);

  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth   = ARC_WIDTH;
  context.arc(16, 16, 16 - ARC_WIDTH / 2, arcStart, arcEnd);
  context.stroke();
}

/** Updates the document's favicon w/ a summary of current stats. */
Title.prototype.updateFavicon = function updateFavicon() {
  var canvas = document.createElement('canvas');
  canvas.height = canvas.width = 32;
  var context = canvas.getContext('2d');

  var passing = this.stats.passes;
  var pending = this.stats.pending;
  var failing = this.stats.failures;
  var total   = Math.max(this.runner.total, passing + pending + failing);
  drawFaviconArc(context, total, 0,                 passing, '#0e9c57');
  drawFaviconArc(context, total, passing,           pending, '#f3b300');
  drawFaviconArc(context, total, pending + passing, failing, '#ff5621');

  this.setFavicon(canvas.toDataURL());
};

/** Sets the current favicon by URL. */
Title.prototype.setFavicon = function setFavicon(url) {
  var current = document.head.querySelector('link[rel="icon"]');
  if (current) {
    document.head.removeChild(current);
  }

  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = url;
  link.setAttribute('sizes', '32x32');
  document.head.appendChild(link);
};

/**
 * @param {CLISocket} socket The CLI socket, if present.
 * @param {MultiReporter} parent The parent reporter, if present.
 * @return {!Array.<!Mocha.reporters.Base} The reporters that should be used.
 */
function determineReporters(socket, parent) {
  // Parents are greedy.
  if (parent) {
    return [parent.childReporter(window.location)];
  }

  // Otherwise, we get to run wild without any parental supervision!
  var reporters = [Title, Console];

  if (socket) {
    reporters.push(function(runner) {
      socket.observe(runner);
    });
  }

  if (htmlSuites$1.length > 0 || jsSuites$1.length > 0) {
    reporters.push(HTML);
  }

  return reporters;
}

/**
 * Yeah, hideous, but this allows us to be loaded before Mocha, which is handy.
 */
function injectMocha(Mocha) {
  _injectPrototype(Console, Mocha.reporters.Base.prototype);
  _injectPrototype(HTML,    Mocha.reporters.HTML.prototype);
  // Mocha doesn't expose its `EventEmitter` shim directly, so:
  _injectPrototype(MultiReporter,   Object.getPrototypeOf(Mocha.Runner.prototype));
}

function _injectPrototype(klass, prototype) {
  var newPrototype = Object.create(prototype);
  // Only support
  Object.keys(klass.prototype).forEach(function(key) {
    newPrototype[key] = klass.prototype[key];
  });

  klass.prototype = newPrototype;
}

/**
 * Loads all environment scripts ...synchronously ...after us.
 */
function loadSync() {
  debug('Loading environment scripts:');
  var a11ySuite = 'web-component-tester/data/a11ySuite.js';
  var scripts = get('environmentScripts');
  var a11ySuiteWillBeLoaded = window.__generatedByWct || scripts.indexOf(a11ySuite) > -1;
  if (!a11ySuiteWillBeLoaded) {
    // wct is running as a bower dependency, load a11ySuite from data/
    scripts.push(a11ySuite);
  }
  scripts.forEach(function(path) {
    var url = expandUrl(path, get('root'));
    debug('Loading environment script:', url);
    // Synchronous load.
    document.write('<script src="' + encodeURI(url) + '"></script>'); // jshint ignore:line
  });
  debug('Environment scripts loaded');

  var imports = get('environmentImports');
  imports.forEach(function(path) {
    var url = expandUrl(path, get('root'));
    debug('Loading environment import:', url);
    // Synchronous load.
    document.write('<link rel="import" href="' + encodeURI(url) + '">'); // jshint ignore:line
  });
  debug('Environment imports loaded');
}

/**
 * We have some hard dependencies on things that should be loaded via
 * `environmentScripts`, so we assert that they're present here; and do any
 * post-facto setup.
 */
function ensureDependenciesPresent() {
  _ensureMocha();
  _checkChai();
}

function _ensureMocha() {
  var Mocha = window.Mocha;
  if (!Mocha) {
    throw new Error('WCT requires Mocha. Please ensure that it is present in WCT.environmentScripts, or that you load it before loading web-component-tester/browser.js');
  }
  injectMocha(Mocha);
  // Magic loading of mocha's stylesheet
  var mochaPrefix = scriptPrefix('mocha.js');
  // only load mocha stylesheet for the test runner output
  // Not the end of the world, if it doesn't load.
  if (mochaPrefix && window.top === window.self) {
    loadStyle(mochaPrefix + 'mocha.css');
  }
}

function _checkChai() {
  if (!window.chai) {
    debug('Chai not present; not registering shorthands');
    return;
  }

  window.assert = window.chai.assert;
  window.expect = window.chai.expect;
}

var SOCKETIO_ENDPOINT = window.location.protocol + '//' + window.location.host;
var SOCKETIO_LIBRARY  = SOCKETIO_ENDPOINT + '/socket.io/socket.io.js';

/**
 * A socket for communication between the CLI and browser runners.
 *
 * @param {string} browserId An ID generated by the CLI runner.
 * @param {!io.Socket} socket The socket.io `Socket` to communicate over.
 */
function CLISocket(browserId, socket) {
  this.browserId = browserId;
  this.socket    = socket;
}

/**
 * @param {!Mocha.Runner} runner The Mocha `Runner` to observe, reporting
 *     interesting events back to the CLI runner.
 */
CLISocket.prototype.observe = function observe(runner) {
  this.emitEvent('browser-start', {
    url: window.location.toString(),
  });

  // We only emit a subset of events that we care about, and follow a more
  // general event format that is hopefully applicable to test runners beyond
  // mocha.
  //
  // For all possible mocha events, see:
  // https://github.com/visionmedia/mocha/blob/master/lib/runner.js#L36
  runner.on('test', function(test) {
    this.emitEvent('test-start', {test: getTitles(test)});
  }.bind(this));

  runner.on('test end', function(test) {
    this.emitEvent('test-end', {
      state:    getState(test),
      test:     getTitles(test),
      duration: test.duration,
      error:    test.err,
    });
  }.bind(this));

  runner.on('childRunner start', function(childRunner) {
    this.emitEvent('sub-suite-start', childRunner.share);
  }.bind(this));

  runner.on('childRunner end', function(childRunner) {
    this.emitEvent('sub-suite-end', childRunner.share);
  }.bind(this));

  runner.on('end', function() {
    this.emitEvent('browser-end');
  }.bind(this));
};

/**
 * @param {string} event The name of the event to fire.
 * @param {*} data Additional data to pass with the event.
 */
CLISocket.prototype.emitEvent = function emitEvent(event, data) {
  this.socket.emit('client-event', {
    browserId: this.browserId,
    event:     event,
    data:      data,
  });
};

/**
 * Builds a `CLISocket` if we are within a CLI-run environment; short-circuits
 * otherwise.
 *
 * @param {function(*, CLISocket)} done Node-style callback.
 */
CLISocket.init = function init(done) {
  var browserId = getParam('cli_browser_id');
  if (!browserId) return done();
  // Only fire up the socket for root runners.
  if (ChildRunner.current()) return done();

  loadScript(SOCKETIO_LIBRARY, function(error) {
    if (error) return done(error);

    var socket = io(SOCKETIO_ENDPOINT);
    socket.on('error', function(error) {
      socket.off();
      done(error);
    });

    socket.on('connect', function() {
      socket.off();
      done(null, new CLISocket(browserId, socket));
    });
  });
};

// Misc Utility

/**
 * @param {!Mocha.Runnable} runnable The test or suite to extract titles from.
 * @return {!Array.<string>} The titles of the runnable and its parents.
 */
function getTitles(runnable) {
  var titles = [];
  while (runnable && !runnable.root && runnable.title) {
    titles.unshift(runnable.title);
    runnable = runnable.parent;
  }
  return titles;
}

/**
 * @param {!Mocha.Runnable} runnable
 * @return {string}
 */
function getState(runnable) {
  if (runnable.state === 'passed') {
    return 'passing';
  } else if (runnable.state == 'failed') {
    return 'failing';
  } else if (runnable.pending) {
    return 'pending';
  } else {
    return 'unknown';
  }
}

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// Make sure that we use native timers, in case they're being stubbed out.
var setInterval           = window.setInterval;           // jshint ignore:line
var setTimeout$1            = window.setTimeout;            // jshint ignore:line
var requestAnimationFrame = window.requestAnimationFrame; // jshint ignore:line

/**
 * Runs `stepFn`, catching any error and passing it to `callback` (Node-style).
 * Otherwise, calls `callback` with no arguments on success.
 *
 * @param {function()} callback
 * @param {function()} stepFn
 */
window.safeStep = function safeStep(callback, stepFn) {
  var err;
  try {
    stepFn();
  } catch (error) {
    err = error;
  }
  callback(err);
};

/**
 * Runs your test at declaration time (before Mocha has begun tests). Handy for
 * when you need to test document initialization.
 *
 * Be aware that any errors thrown asynchronously cannot be tied to your test.
 * You may want to catch them and pass them to the done event, instead. See
 * `safeStep`.
 *
 * @param {string} name The name of the test.
 * @param {function(?function())} testFn The test function. If an argument is
 *     accepted, the test will be treated as async, just like Mocha tests.
 */
window.testImmediate = function testImmediate(name, testFn) {
  if (testFn.length > 0) {
    return testImmediateAsync(name, testFn);
  }

  var err;
  try {
    testFn();
  } catch (error) {
    err = error;
  }

  test(name, function(done) {
    done(err);
  });
};

/**
 * An async-only variant of `testImmediate`.
 *
 * @param {string} name
 * @param {function(?function())} testFn
 */
window.testImmediateAsync = function testImmediateAsync(name, testFn) {
  var testComplete = false;
  var err;

  test(name, function(done) {
    var intervalId = setInterval(function() {
      if (!testComplete) return;
      clearInterval(intervalId);
      done(err);
    }, 10);
  });

  try {
    testFn(function(error) {
      if (error) err = error;
      testComplete = true;
    });
  } catch (error) {
    err = error;
    testComplete = true;
  }
};

/**
 * Triggers a flush of any pending events, observations, etc and calls you back
 * after they have been processed.
 *
 * @param {function()} callback
 */
window.flush = function flush(callback) {
  // Ideally, this function would be a call to Polymer.dom.flush, but that doesn't
  // support a callback yet (https://github.com/Polymer/polymer-dev/issues/851),
  // ...and there's cross-browser flakiness to deal with.

  // Make sure that we're invoking the callback with no arguments so that the
  // caller can pass Mocha callbacks, etc.
  var done = function done() { callback(); };

  // Because endOfMicrotask is flaky for IE, we perform microtask checkpoints
  // ourselves (https://github.com/Polymer/polymer-dev/issues/114):
  var isIE = navigator.appName == 'Microsoft Internet Explorer';
  if (isIE && window.Platform && window.Platform.performMicrotaskCheckpoint) {
    var reallyDone = done;
    done = function doneIE() {
      Platform.performMicrotaskCheckpoint();
      setTimeout$1(reallyDone, 0);
    };
  }

  // Everyone else gets a regular flush.
  var scope;
  if (window.Polymer && window.Polymer.dom && window.Polymer.dom.flush) {
    scope = window.Polymer.dom;
  } else if (window.Polymer && window.Polymer.flush) {
    scope = window.Polymer;
  } else if (window.WebComponents && window.WebComponents.flush) {
    scope = window.WebComponents;
  }
  if (scope) {
    scope.flush();
  }

  // Ensure that we are creating a new _task_ to allow all active microtasks to
  // finish (the code you're testing may be using endOfMicrotask, too).
  setTimeout$1(done, 0);
};

/**
 * Advances a single animation frame.
 *
 * Calls `flush`, `requestAnimationFrame`, `flush`, and `callback` sequentially
 * @param {function()} callback
 */
window.animationFrameFlush = function animationFrameFlush(callback) {
  flush(function() {
    requestAnimationFrame(function() {
      flush(callback);
    });
  });
};

/**
 * DEPRECATED: Use `flush`.
 * @param {function} callback
 */
window.asyncPlatformFlush = function asyncPlatformFlush(callback) {
  console.warn('asyncPlatformFlush is deprecated in favor of the more terse flush()');
  return window.flush(callback);
};

/**
 *
 */
window.waitFor = function waitFor(fn, next, intervalOrMutationEl, timeout, timeoutTime) {
  timeoutTime = timeoutTime || Date.now() + (timeout || 1000);
  intervalOrMutationEl = intervalOrMutationEl || 32;
  try {
    fn();
  } catch (e) {
    if (Date.now() > timeoutTime) {
      throw e;
    } else {
      if (isNaN(intervalOrMutationEl)) {
        intervalOrMutationEl.onMutation(intervalOrMutationEl, function() {
          waitFor(fn, next, intervalOrMutationEl, timeout, timeoutTime);
        });
      } else {
        setTimeout$1(function() {
          waitFor(fn, next, intervalOrMutationEl, timeout, timeoutTime);
        }, intervalOrMutationEl);
      }
      return;
    }
  }
  next();
};

// You can configure WCT before it has loaded by assigning your custom
// configuration to the global `WCT`.
setup(window.WCT);

// Maybe some day we'll expose WCT as a module to whatever module registry you
// are using (aka the UMD approach), or as an es6 module.
var WCT = window.WCT = {};
// A generic place to hang data about the current suite. This object is reported
// back via the `sub-suite-start` and `sub-suite-end` events.
WCT.share = {};
// Until then, we get to rely on it to expose parent runners to their children.
WCT._ChildRunner = ChildRunner;
WCT._config      = _config;


// Public Interface

/**
 * Loads suites of tests, supporting both `.js` and `.html` files.
 *
 * @param {!Array.<string>} files The files to load.
 */
WCT.loadSuites = loadSuites;


// Load Process

listenForErrors();
stubInterfaces();
loadSync();

// Give any scripts on the page a chance to declare tests and muck with things.
document.addEventListener('DOMContentLoaded', function() {
  debug('DOMContentLoaded');

  ensureDependenciesPresent();

  // We need the socket built prior to building its reporter.
  CLISocket.init(function(error, socket) {
    if (error) throw error;

    // Are we a child of another run?
    var current = ChildRunner.current();
    var parent  = current && current.parentScope.WCT._reporter;
    debug('parentReporter:', parent);

    var childSuites    = activeChildSuites();
    var reportersToUse = determineReporters(socket, parent);
    // +1 for any local tests.
    var reporter = new MultiReporter(childSuites.length + 1, reportersToUse, parent);
    WCT._reporter = reporter; // For environment/compatibility.js

    // We need the reporter so that we can report errors during load.
    loadJsSuites(reporter, function(error) {
      // Let our parent know that we're about to start the tests.
      if (current) current.ready(error);
      if (error) throw error;

      // Emit any errors we've encountered up til now
      globalErrors.forEach(function onError(error) {
        reporter.emitOutOfBandTest('Test Suite Initialization', error);
      });

      runSuites(reporter, childSuites, function(error) {
        // Make sure to let our parent know that we're done.
        if (current) current.done();
        if (error) throw error;
      });
    });
  });
});

})();
//# sourceMappingURL=browser.js.map