# [gulp](https://github.com/gulpjs/gulp)-html-extract [![Build Status](https://secure.travis-ci.org/FormidableLabs/gulp-html-extract.png?branch=master)](http://travis-ci.org/FormidableLabs/gulp-html-extract)

> Extract text from HTML content into pseudo-files for further Gulp processing.

## Install

Install with [npm](https://npmjs.org/package/gulp-html-extract)

```
npm install --save-dev gulp-html-extract
```

## Example

A good use case is extracting JavaScript from `<script>` tags and then piping
to [gulp-jshint](https://github.com/spenceralger/gulp-jshint). Here, we
extract JavaScript from `<script>` tags and anything matching the
`code.javascript` CSS selector:

```js
var gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  extract = require("gulp-html-extract");

gulp.task("jshint:html", function () {
  gulp
    .src("site/**/*.html")
    .pipe(extract({
      sel: "script, code.javascript"
    }))
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});
```

## Pseudo-Files

The plugin extracts each text snippet from an HTML source as an independent
faux [Vinyl](https://github.com/wearefractal/vinyl) file, with a path of:
`HTML_PATH-ELEMENT_ID` or `HTML_PATH-TAG_NAME-INDEX` (if no `id` attribute).

Some examples:

```
path/to/file1.html-CODE-1
path/to/file2.html-my-identifier
```

## API

### extract(opts)

#### opts.sel

CSS selector string to match on. Default: `script`.

#### opts.strip

Strip to indented level of first non-whitespace character. Removes whitespace-
only starting and ending lines around real text. Default: `false`
