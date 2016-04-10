# 4.x
## 4.2.2
* Update bower dependencies to match node dependencies
* Update rollup to 0.25
* Update README to point to webcomponents-lite.js
## 4.2.1
* Fix `grep` for upstream mocha bug
## 4.2.0
* Add `httpbin` functionality to check `POST` requests
  * `POST` to `/httpbin`, response will be contents of `POST`

## 4.1.0
* Add `ignoreRules` option to `a11ySuite`
    * Array of a11ySuite rules to ignore for that suite
    * Example: https://github.com/PolymerElements/paper-tooltip/commit/bf22b1dfaf7f47312ddb7f5415f75ae81fa467bf

## 4.0.3
* Fix npm 3 serving for lodash and sinon

## 4.0.2
* Fix serving from `node_modules` for npm 3

## 4.0.1
* Fix Polymer 0.5 testing

## 4.0.0
* Remove `bower` as a dependency, serve testing files out of `node_modules`
* Upgrade to `wct-local` 2.0, which needs node 0.12+ for `launchpad` 0.5
* Replace esperanto with rollup for building browser bundle

# 3.x

## 3.4.0
* Integrate [test-fixture](https://github.com/PolymerElements/test-fixture)

## 3.3.0
* Add ability to cancel running tests from library

## 3.2.0
* Add accessibility testing with `a11ySuite` and
    [accessibility-developer-tools](https://github.com/GoogleChrome/accessibility-developer-tools)

## 3.1.3

* `.bowerrc` included in the package to ensure that packages don't get placed in
  unexpected locations.

## 3.1.2

* `--verbose` now includes logging from [`serve-waterfall`](https://github.com/PolymerLabs/serve-waterfall).

## 3.1.1

* WCT now depends on `wct-sauce ^1.5.0`

## 3.1.0

* WCT proper no longer periodically executes webdriver commands to ensure remote
  keepalive. Logic has moved into `wct-sauce`.

* Fix for verbose mode breaking IE10.

## 3.0.7

* Mixing TDD & BDD Mocha interfaces is now an error.

* Calls to `console.error` now generate an error.

* Errors that occur during WCT's initialization are more reliably reported.

* WCT now treats dependencies installed into `bower_components/` as if they are
  siblings of the current repo (much like polyserve).

* Browser libraries are no longer bundled with WCT.

  * They are now bower-managed, and by default installed to `bower_components/`
    within `web-component-tester`.

  * The libraries loaded can be configured via `WCT = {environmentScripts: []}`.

  * Massive overhaul of `browser.js` to support this & `environment.js` no
    longer exists.

* Support for newer versions of webcomponents.js (also Polymer 0.8).

* Mocha configuration can be specified by the `mochaOptions` key in client
  options (i.e. `<script>WCT = {mochaOptions: {}};</script>`).

* Browser options can be specified in `wct.conf.js` via the `clientOptions` key.

* WCT now always generates an index when run via the command line.

* `wct.conf.json` can be used as an alternative to `wct.conf.js`.

## 3.0.0-3.0.6

Yanked. See `3.0.7` for rolled up notes.


# 2.x

There were changes made, and @nevir failed to annotate them. What a slacker.


# 1.x

What are you, an archaeologist?
