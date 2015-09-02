# Add ES2015 support through Babel

Although support for ES2015 (formerly ES6) is improving in modern browsers, the majority do not yet support the full set of features. To benefit from the awesomeness of the new ES2015 syntax while keeping backwards compatibility with Polymer's supported browsers, you'll need to transpile your JS code from ES2015 to ES5

This recipe focuses on adding an ES2015 to ES5 transpile step to Polymer Starter Kit's build pipeline using [BabelJS](https://babeljs.io/).


## Create a transpile gulp task

- Install the gulp Babel, Sourcemap and Crisper plugins: `npm install --save-dev gulp-babel gulp-sourcemaps gulp-crisper`
- Add the following gulp task in the `gulpfile.js` file:

```javascript
// Transpile all JS to ES5.
gulp.task('js', function () {
  return gulp.src(['app/**/*.{js,html}'])
    .pipe($.sourcemaps.init())
    .pipe($.if('*.html', $.crisper())) // Extract JS from .html files
    .pipe($.if('*.js', $.babel()))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/'))
    .pipe(gulp.dest('dist/'));
});
```

This task will transpile all JS files and inline JS inside HTML files and also generate sourcemaps. The resulting files are generated in the `.tmp` and the `dist` folders

[Crisper](https://github.com/PolymerLabs/crisper) extracts JavaScript that's inline to HTML files (such as imports). We need this as Babel does not support transpiling HTML files such as `<script>` tags directly

Note: At the time of writing Crisper does not generate the sourcemaps. Your app will work but you won't get sourcemaps for files transformed by Crisper. Relevant issues:

 - [ragingwind/gulp-crisper#4](https://github.com/ragingwind/gulp-crisper/issues/4)
 - [PolymerLabs/crisper#14](https://github.com/PolymerLabs/crisper/issues/14)
 

## Integrating the transpile task

Make sure the `js` gulp task is triggered by the common build tasks:

 - In the gulp `serve` task, make sure `js` is triggered initially and on HTML and JS files changes:

```javascript
gulp.task('serve', ['styles', 'elements', 'images', 'js'], function () {

  ...

  gulp.watch(['app/**/*.html'], ['js', reload]);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/elements/**/*.css'], ['elements', reload]);
  gulp.watch(['app/{scripts,elements}/**/*.js'], ['jshint', 'js']);
  gulp.watch(['app/images/**/*'], reload);
});
```

 - In the `default` task make sure `js` is run in parallel to `elements`:

```javascript
gulp.task('default', ['clean'], function (cb) {

  ...

        ['elements', 'js'],

  ...
  
});
```

 - In the `html` task remove the `app` useref search path to make sure the ES2015 JS files aren't picked up. We don't need `app` anymore because all JS and HTML files are in `.tmp`:

```javascript
// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'dist']});

  ...

});
```


## Configure linters for ES2015

- Enable ES2015 support in JSCS. Add `"esnext": true` to the `.jscsrc` file:

```json
{
  "esnext": true,
  "preset": "google",
  "disallowSpacesInAnonymousFunctionExpression": null,
  "excludeFiles": ["node_modules/**"]
}
```

- Enable ES2015 support in JSHint. Add `"esnext": true` to the `.jshintrc` file:

```
{
  "esnext": true,
  "node": true,
  "browser": true,
  
  ...
  
}
```
