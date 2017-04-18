### 1.14.7
- Fix inlining for firebase and other scripts that use `\\x3c/script` syntax
  when making more scripts

### 1.14.6
- Make sure `@license` comments always are maintained

### 1.14.5
- Fix dom5 dependency to 1.3+

### 1.14.4
- Make sure `<link rel="import type="css">` inlining is placed into a
  `<dom-module>`'s `<template>`

### 1.14.3
- Fix for trailing slash in `<base>` tag

### 1.14.2
- Fix paths when preserving execution order moves scripts to body

### 1.14.1
- Escape inline scripts
- Strip Excludes fixed to have higher precedence than Excludes
- Fix script execution order with imports, once and for all!

### 1.14.0
- Add `output` option to write file from CLI

### 1.13.1
- Strip Excludes should be fuzzy

### 1.13.0
- Support custom hydrolysis file loaders

### 1.12.3
- Make sure `excludes` works with `redirects`

### 1.12.2
- Fix CLI spelling of `redirects`

### 1.12.1
- Fix misspelling of `redirects` in library options

### 1.12.0
- New `--redirect` flag and `redirect` argument to set up custom path mappings

### 1.11.0
- New `-add-import` flag and `addedImports` argument to add additional imports
    to the target file.
- Copy `@media` queries on external CSS files into inlined styles.
- Fix excluding css files from computing dependencies.

### 1.10.5
- Fix a dumb unix path assumption for --inline-scripts and --inline-css +
    absolute paths on windows.

### 1.10.4
- Fix excludes for js files and folders

### 1.10.3
- Fix regression in --strip-comments from 1.9.0

### 1.10.2
- Use URLs internally until calling hydrolysis
- Fixes a bunch of inline issues for Windows

### 1.10.1
- Typecheck inputs in library usage
- Fix README to say that `stripExcludes` is an Array not a Boolean

### 1.10.0
- Add `inputUrl` option to work around grunt and gulp plugins providing
  filepaths that cannot be used as URLs to `vulcanize.process()`

### 1.9.3
- Fix abspath bug on windows machines

### 1.9.2
- Use new class API in binary
- Update dependencies

### 1.9.1
- Fix `implicitStrip` in new Class based API

### 1.9.0
- New class based API:
```js
var Vulcanize = require('vulcanize');

var vulcan = new Vulcanize(options);
vulcan.process(...);
```
- `vulcanize.setOptions` and `vulcanize.process` are deprecated
### 1.8.1
- Bump hydrolysis to 1.12.0 with proper ordering

### 1.8.0
- Make stripComments work more reliably

### 1.7.1
- Don't try to inline styles from external sources

### 1.7.0
- Inline link[rel="stylesheet"] css as well as polymer import stylesheets

### 1.6.0
- Update usage of private API of hydrolysis
- Correctly set 'implicit strip' option when used programatically

### 1.5.1
- Ignore external (http and https) resources from inlining

### 1.5.0
- Error on the use of old Polymer elements. Vulcanize 0.7.x is the last version
    that will handle &lt; Polymer 0.8.
- Rewrite urls for inlined styles

### 1.4.4
- Make sure excluded js files are totally removed (they inserted blank script
    tags)

### 1.4.3
- Update dependencies and docs
- Dependency update fixes cyclic dependencies

### 1.4.2
- Fix URL rewriting from parts of imports that end up in `<body>`

### 1.4.1
- `--implicit-strip` is default
- Remove "comment normalization" when stripping, it was not self-stable

### 1.4.0
- Add `--strip-comments` to remove unnecessary comments

### 1.3.0
- Add `--inline-css` option to inline external stylesheets

### 1.2.1
- Update dependencies

### 1.2.0
- Change `--strip-exclude` to be an array of excludes to strip
- `--implicit-strip` is the old `--strip-excludes` behavior

### 1.1.0
- Add `--inline-scripts` option to inline external scripts

### 1.0.0
- Rewrite on top of [hydrolysis](https://github.com/PolymerLabs/hydrolysis) and
[dom5](https://github.com/PolymerLabs/dom5)
- Factor out `--csp` flag into [crisper](https://github.com/PolymerLabs/crisper)
- Remove html and javascript minification

### 0.7.10
- Collapse whitespace instead of removing it
- Keep unique license comments

### 0.7.9
- Honor `<base>` urls in inline styles

### 0.7.8
- Update to whacko 0.17.3

### 0.7.7
- Honor `<base>` tag
- Make all schemas "absolute" urls

### 0.7.6
- Don't rewrite urls starting with '#'

### 0.7.5
- Remove cssom, just use regexes

### 0.7.4
- Workaround for cssom not liking '{{ }}' bindings in `<style>` tags (unsupported, use `<core-style>` instead)

### 0.7.3
- Replace clean-css with cssom, which does less "optimizations"

### 0.7.2
- Disable css number rounding for crazy-sad flexbox hacks in IE 10
- Add charset=utf-8 to all scripts
- Better comment removal codepath

### 0.7.1
- Support for mobile URL Schemes "tel:" and "sms:"
- Better reporting of javascript error messages with `--strip`
- Handle buffers as input with `inputSrc`
- Rename `outputSrc` to `outputHandler`

### 0.7.0
- Upgrade to whacko 0.17.2 with template support
- add utils.searchAll to make a query that walks into `<template>` elements

### 0.6.2
- stick to whacko 0.17.1 until `<template>` support is complete

### 0.6.1
- fix bug with removing absolute imports

### 0.6.0
- Strip excluded imports by default (old behavior accessible with --no-strip-excludes flag)

### 0.5.0
- finally switch to new-world polymer license
- Add a bunch of tests for lib/vulcan
- Refactor test suites
- tests for utils and optparser modules
- Merge pull request #83 from jongeho1/undefined-element
- undefined element fix
- remove unnecessary require statement
- Handle indirect prototype references in Polymer invocation
- plumb abspath to all url rewriting
- shields!
- add travis config
- add tests!
- Add option for printing version and nag to update
- move test folder to example
- Merge branch 'master' of github.com:rush340/vulcanize into rush340-master
- Merge pull request #75 from ragingwind/remove-importerjs
- Merge pull request #77 from Polymer/use-whacko
- Keep consistent ordering of import document heads and bodies
- Don't create a whole document for inlining styles
- Switch to whacko/parse5
- fix flipped conditional
- Merge pull request #76 from ragingwind/buffer
- Support buffer in/out
- Remove importer.js
- more explicit checking of whether abspath is set
- cleaned up regex matching of root
- renamed webAbsPath to abspath
- fixed cheerio options to perform the same parsing while reading and writing
- if webAbsPath is passed in, use absolute paths everywhere
- resolve webAbsPath if relative path provided
- added recognition of double-slash paths as a remote absolute URL
- applied webAbsPath option for handling absolute paths (based on jongeho1's pull request: https://github.com/Polymer/vulcanize/pull/36)

### 0.4.3
- Release 0.4.3
- Mailto: is an absolute path
- Merge pull request #70 from rush340/htmlentities
- added missing use of CHEERIO_OPTIONS
- fixed cheerio options to perform the same parsing while reading and writing
- Merge pull request #59 from mozilla-appmaker/cheerio-write-fix
- Merge pull request #65 from tbuckley/patch-1
- Add quotes around filenames in CSS
- audit license headers
- fixed cheerio options to perform the same parsing while reading and writing
- Never decode entities

### 0.4.2
- Fix inline svgs
- Update README with --strip functionality

### 0.4.1
- Bump version to 0.4.1
- Strip comments and whitespace from all nodes

### 0.4.0
- Bump to version 0.4.0
- Replace noscript with explicit Polymer invocation, to ensure correct element registration order when CSP'ed.

### 0.3.1
- remove extraneous async module
- Fixes #34

### 0.3.0
- Hide import content from view in the main document

### 0.2.7
- always add name to polymer invocation

### 0.2.6
- bump version
- add small usage block to help
- Make --strip work with --csp
- Clean up use of get/setTextContent
- Inline stylesheet happens after import path fixup, so outputPath of rewriteURL should be the overall outputPath

### 0.2.5
- update to 0.2.5
- .text() was decoding HTML entities, read raw script node content for CSP
- Support Polymer invocation without tag name
- Fix slightly broken merge conflict
- Enable `--inline --csp` mode to smash everything into one JS file
- Upstream cheerio changed loop semantics to return "dom" nodes instead of sugared cheerio objects
- Fix #29
- Print help dialog if called without arguments
- update dependencies

### 0.2.4
- Treat config file as "defaults", commandline flags override
- Do path resolution before import processing and style inlining

### 0.2.3
- A few bug fixes

### 0.2.2
- Don't recalculate assetpath for handled elements
- Bump to 0.2.1

### 0.2.1
- unbreak assetpath generation

### 0.2.0
- Prepare vulcanize 0.2.0
- Merge pull request #25 from lborgav/patch-1
- Fixing missing letters
- Don't move external scripts around with CSP mode
- Use uglify inline_script
- Use cleancss only for stripping comments
- Merge pull request #21 from azakus/modular
- went a little too quick with the regex
- Remove byte order mark
- Make sure not to lose assetpath fix
- First draft at a split out Importer
- Inplace inline *all* imports
- Copy setTextNode since it's so tiny
- move all the option validation into optparser
- Update npm dependencies
- Split out path resolution
- Break out option parser
- Break out constants
- Add the hooks for style and script excludes
- Add changelog generation script
- Merge pull request #16 from tbuckley/master
- Include excluded script instead of its contents
- Only put a trailing slash into assetpath attribute if there is a path
- bump version
- clone all styles (minus href and rel) from `<link>` to `<style>`
- update to 0.1.13
- Skip non-JS scripts and non-CSS styles
- bump version
- Make sure to CSPify main document first, load platform.js first in the output js file.
- add test config for excluding polymer.html
- Refactor handling of inlined and excluded import insertion
- bump version
- Fix subtle path bug in stylesheets
- use uglify and clean-css to strip comments from js and css when using --strip
- Clean up
- bump version
- --csp will now operate on the input html file as well
- Fix script inlining to ignore parsing html comments
- cheerio 0.13 seems to work just fine
- inline stylesheets in the main page when using --inline
- README: add ga beacon

### 0.1.9
- Reset excludes on each run

### 0.1.8
- Bump version
- add "strip comments" functionality
- fix minor typo in helep text: s/defualts/defaults

### 0.1.7
- bump version
- add sub-import test to the top level import
- Add --config option to specify user defined excludes
- Add user-defined excludes from inling.

### 0.1.6
- bump version
- test with absolute urls
- remove console.log
- Deduplicate absolute url imports
- fix missing absolute imports

### 0.1.5
- bump to 0.1.5
- Revert "polymer-scope is no longer supported"

### 0.1.4
- reset shared buffers on each handleMainDocument call

### 0.1.3
- bump version
- move option checking to setOptions, not the bin
- Add npm installation instructions
- polymer-scope is no longer supported

### 0.1.2

### 0.1.15
- Only put a trailing slash into assetpath attribute if there is a path

### 0.1.14
- bump version
- clone all styles (minus href and rel) from `<link>` to `<style>`

### 0.1.13
- update to 0.1.13
- Skip non-JS scripts and non-CSS styles

### 0.1.12
- bump version
- Make sure to CSPify main document first, load platform.js first in the output js file.
- add test config for excluding polymer.html
- Refactor handling of inlined and excluded import insertion

### 0.1.11
- bump version
- Fix subtle path bug in stylesheets
- use uglify and clean-css to strip comments from js and css when using --strip
- Clean up

### 0.1.10
- bump version
- --csp will now operate on the input html file as well
- Fix script inlining to ignore parsing html comments
- cheerio 0.13 seems to work just fine
- inline stylesheets in the main page when using --inline
- README: add ga beacon
- Reset excludes on each run
- Bump version
- add "strip comments" functionality
- fix minor typo in helep text: s/defualts/defaults
- bump version
- add sub-import test to the top level import
- Add --config option to specify user defined excludes
- Add user-defined excludes from inling.
- bump version
- test with absolute urls
- remove console.log
- Deduplicate absolute url imports
- fix missing absolute imports
- bump to 0.1.5
- Revert "polymer-scope is no longer supported"
- reset shared buffers on each handleMainDocument call
- bump version
- move option checking to setOptions, not the bin
- Add npm installation instructions
- polymer-scope is no longer supported
- bump version
- update README to be more approachable
- add a help dialog, fix "main" in package.json

### 0.1.1
- Bump version to 0.1.1
- Fix paths from main html file if input or output directories are not current working directory
- Add style url rewriting back
- add other directories to testing
- Merge pull request #3 from akhileshgupta/inline_styles_fix
- Merge pull request #2 from akhileshgupta/concat_scripts_bugfix
- variable rename and removing the unrequired check
- fixing the use of .html(cssText) to update the styles content.
- resolving script path from outputDir  during concatenation
- Merge pull request #1 from addyosmani/patch-1
- Adds npm install snippet, minor formatting changes.

### 0.1.0
- semver recommends starting at 0.1.0
- add repo info to package.json

### 0.0.1
- Update README.md
- add license top
- remove unrelated viz file
- add license files
- reference new executable path
- reference bin/vulcanize for global npm install
- split vulcan.js into vulcanize bin and lib/vulcan.js
- reorder constant variables, add missing SCRIPT_SRC
- inlineScripts now uses html text and regex, not cheerio api
- Use html() to inline scripts, text() makes HTML Entities
- Add --inline option to inline all scripts into main document (opposite of --csp)
- Update README to reflect all-in-one html files
- Try to insert inlined import exactly where the link was
- make everything from imports inlined
- update README with index-vulcanized output
- Inlined stylesheets must have URL paths rewritten, move to import processing
- inline css stylesheets into style tags in polymer elements
- assetpath is handled by polymer now
- Update README.md
- Update README.md
- Remove unused function
- fix import location finding and windows path munging
- Fix output directory for CSP js file
- find better spots for vulcanized imports and scripts
- Update to newer cheerio with fixed htmlparser
- reflect new functionality in README, fix up newline issues, refactor constants
- vulcanizer will now take in a single main document and produce a built version of that main document.
- add a semicolon to all scripts to prevent weird insertion conditions
- update README for CSP mode
- For CSP, allow an option to separate scripts into a separate file
- Process imports as whole files, no element extraction
- breaking down doc tool for analysis
- Update README for polymer-element
- update for polymer-element
- Much more useful README
- use assetpath attribute on `<element>` to fix resolvePath usage in Polymer elements
