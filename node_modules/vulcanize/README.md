[![NPM version](http://img.shields.io/npm/v/vulcanize.svg)](https://npmjs.org/package/vulcanize)
[![Build Status](http://img.shields.io/travis/Polymer/vulcanize.svg)](https://travis-ci.org/Polymer/vulcanize)

# Vulcanize

### Reduce an HTML file and its dependent HTML Imports into one file

>Named for the [Vulcanization](http://en.wikipedia.org/wiki/Vulcanization) process that turns polymers into more durable
materials.

Web pages that use multiple [HTML Imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/) to load dependencies may end up making lots of network round-trips. In many cases, this can lead to long initial load times and unnecessary bandwidth usage. The Vulcanize tool follows HTML Imports and `<script>` tags to inline these external assets into a single page, to be used in production.

In the future, technologies such as [HTTP/2](http://en.wikipedia.org/wiki/HTTP/2) and [Server Push](https://http2.github.io/faq/#whats-the-benefit-of-server-push) will likely obsolete the need for a tool like vulcanize for production uses.

## Installation

`vulcanize` is available on npm. For maximium utility, `vulcanize` should be installed globally.

    npm install -g vulcanize

This will install `vulcanize` to `/usr/local/bin/vulcanize` (you may need `sudo`
for this step).

## Options
- `-h`|`--help`: print this message
- `-v`|`--version`: print version number
- `-p <arg>`|`--abspath <arg>`: use <arg> as the "webserver root", make all adjusted urls absolute
- `--exclude <path>`: exclude a subpath from root. Use multiple times to exclude multiple paths. Tags (imports/scripts/etc) that reference an excluded path are left in-place, meaning the resources are not inlined. ex: `--exclude=elements/x-foo.html --exclude=elements/x-bar.html`
- `--strip-exclude`: Exclude a subpath and remove any links referencing it.
- `--inline-scripts`: Inline external scripts.
- `--inline-css`: Inline external stylesheets.
- `--add-import <path>`: Add this import to the target HTML before vulcanizing. Can be used multiple times.
- `--redirect <uri>|<path>`: Takes an argument in the form of URI|PATH where url is a URI composed of a protocol, hostname, and path and PATH is a local filesystem path to replace the matched URI part with. Multiple redirects may be specified; the earliest ones have the highest priority.
- `--strip-comments`: Strips all HTML comments not containing an @license from the document.
- `--no-implicit-strip`: *DANGEROUS*! Avoid stripping imports of the transitive dependencies of imports specified with `--exclude`. May result in duplicate javascript inlining.
- `--out-html <path>`: If specified, output will be written to <path> instead of stdout.

## Usage
The command

    vulcanize target.html

will inline the HTML Imports of `target.html` and print the resulting HTML to
standard output.

The command

    vulcanize target.html > build.html

will inline the HTML Imports of `target.html` and print the result to
`build.html`.

The command

    vulcanize -p "path/to/target/" /target.html

will inline the HTML Imports of `target.html`, treat `path/to/target/` as the
webroot of target.html, and make all urls absolute to the provided webroot.

The command

    vulcanize --exclude "path/to/target/subpath/" --exclude "path/to/target/subpath2/" target.html

will inline the HTML Imports of `target.html` that are not in the directory
`path/to/target/subpath` nor `path/to/target/subpath2`.

If the `--strip-exclude` flag is used, the HTML Import `<link>` tags that
point to resources in `path/totarget/subpath` and `path/to/target/subpath2/`
will also be removed.

The command

    vulcanize --inline-scripts target.html

will inline scripts in `target.html` as well as HTML Imports. Exclude flags will apply to both Imports and Scripts.

The command

    vulcanize --inline-css target.html

will inline Polymerized stylesheets, `<link rel="import" type="css">`

The command

    vulcanize --strip-comments target.html

will remove HTML comments, except for those that begin with `@license`.
License comments will be deduplicated.

## Using vulcanize programmatically

Vulcanize as a library has two exported function.

`vulcanize` constructor takes an object of options similar to the command line
options.
- `abspath`: A folder to treat as "webroot".
  - When specified, use an absolute path to `target`.
- `excludes`: An array of strings with regular expressions to exclude paths from being inlined.
- `stripExcludes`: Similar to `excludes`, but strips the imports from the output entirely.
    - If `stripExcludes` is empty, it will be set the value of `excludes` by default.
- `inlineScripts`: Inline external scripts.
- `inlineCss`: Inline external stylesheets.
- `addedImports`: Additional HTML imports to inline, added to the end of the
    target file
- `redirects`: An array of strings with the format `URI|PATH` where url is a URI composed of a protocol, hostname, and path and PATH is a local filesystem path to replace the matched URI part with. Multiple redirects may be specified; the earliest ones have the highest priority.
- `stripComments`: Remove non-license HTML comments.
- `inputUrl`: A URL string that will override the `target` argument to
    `vulcanize.process()`.
    By design, gulp and grunt plugins expect to work on the given file path.
    `vulcanize` has its own file loader, and expects to be given URLs. In
    instances where the filename cannot be used as a URL `inputUrl` will
    override the filename.
- `loader`: A [hydrolysis](https://www.npmjs.com/package/hydrolysis) loader.
    This loader is generated with the `target` argument to `vulcan.process` and
    the `exclude` paths. A custom loader can be given if more advanced setups
    are necesssary.

`vulcanize.process` takes a `target` path to `target.html` and a callback.

Example:
```js
var Vulcanize = require('vulcanize');
var hydrolysis = require('hydrolysis');

/* a Hydrolysis loader object (optional) */
var loader = new hydrolysis.loader(...)

var vulcan = new Vulcanize({
  abspath: '',
  excludes: [
    '\\.css$'
  ],
  stripExcludes: [
  ],
  inlineScripts: false,
  inlineCss: false,
  addedImports: [
  ],
  redirects: [
  ],
  implicitStrip: true,
  stripComments: false
  // optional
  loader: loader,
  inputUrl: ''
});

vulcan.process(target, function(err, inlinedHtml) {
});
```

## Caveats

Because HTML Imports changes the order of execution scripts can have, Vulcanize
has to make a few compromises to achieve that same script execution order.

1. Contents of all HTML Import documents will be moved to `<body>`

1. Any scripts after a `<link rel="import">` node in `<head>` will be moved to `<body>` after the contents of the HTML Import.

## What happened to [feature] from 0.X?
- `--csp` mode has been moved into [crisper](https://github.com/PolymerLabs/crisper)
- `--strip` mode was removed, use something like [html-minifier](https://github.com/kangax/html-minifier) or [minimize](https://github.com/Moveo/minimize)
  - Use these at your own risk, they may not understand all of Polymer's uses of HTML or CSS (https://github.com/kangax/html-minifier/issues/377)

## What about build tools
- [grunt-vulcanize](https://www.npmjs.com/package/grunt-vulcanize)
- [gulp-vulcanize](https://www.npmjs.com/package/gulp-vulcanize)
- [broccoli-vulcanize](https://www.npmjs.com/package/broccoli-vulcanize)

[![Analytics](https://ga-beacon.appspot.com/UA-39334307-2/Polymer/vulcanize/README)](https://github.com/igrigorik/ga-beacon)
