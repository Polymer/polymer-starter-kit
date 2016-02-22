# Add lint support with JSHINT and JSCS

This recipe helps you to create a task to use [JSCS](http://jscs.info/) and [JSHINT](http://jshint.com/) in your code. 


## Create .jshintrc file in the root folder

```
{
  "node": true,
  "browser": true,
  "bitwise": true,
  "camelcase": true,
  "curly": true,
  "eqeqeq": true,
  "immed": true,
  "indent": 2,
  "latedef": true,
  "noarg": true,
  "quotmark": "single",
  "undef": true,
  "unused": true,
  "newcap": false,
  "globals": {
    "Polymer": true,
    "page": true,
    "app": true
  }
}
```

## Create .jscsrc file in the root folder

```
{
  "preset": "google",
  "disallowSpacesInAnonymousFunctionExpression": null,
  "disallowTrailingWhitespace": null,
  "maximumLineLength": 100,
  "excludeFiles": ["node_modules/**"]
}
```


## Create a lint gulp task

- Install the gulp-jshint, jshint-stylish, gulp-jscs, gulp-jscs-stylish, gulp-html-extract: `npm install --save-dev gulp-jscs gulp-jscs-stylish gulp-html-extract gulp-jshint jshint-stylish`
- Add the following gulp task in the `gulpfile.js` file:

```patch
+ // Lint JavaScript
+ gulp.task('lint', function() {
+   return gulp.src([
+       'app/scripts/**/*.js',
+       'app/elements/**/*.js',
+       'app/elements/**/*.html',
+       'gulpfile.js'
+     ])
+     .pipe(reload({
+       stream: true,
+       once: true
+     }))
+ 
+   // JSCS has not yet a extract option
+   .pipe($.if('*.html', $.htmlExtract()))
+   .pipe($.jshint())
+   .pipe($.jscs())
+   .pipe($.jscsStylish.combineWithHintResults())
+   .pipe($.jshint.reporter('jshint-stylish'))
+   .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
+ });
```

This task will check all JS files and JS inside HTML files.

### Note

Due to the JSCS task does not extract JS inside HTML files as JSHINT does, it is necessary to use an [gulp-html-extract](https://github.com/FormidableLabs/gulp-html-extract) task to do this.


## Integrating the lint task

Make sure the `lint` gulp task is triggered by the common build tasks:

 - In the gulp `serve` task, make sure `lint` is triggered initially and on HTML and JS files changes:

```patch
-gulp.task('serve', ['styles', 'elements'], function () {
+gulp.task('serve', ['lint', 'styles', 'elements'], function () {

  ...

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/elements/**/*.css'], ['elements', reload]);
+ gulp.watch(['app/{scripts,elements}/**/{*.js,*.html}'], ['lint']);
  gulp.watch(['app/images/**/*'], reload);
});
```

 - In the `default` task make sure `lint` is run in parallel to `images`, `fonts` and `html`:

```patch
gulp.task('default', ['clean'], function (cb) {

  ...

  runSequence(
    ['copy', 'styles'],
   'elements',
-    ['images', 'fonts', 'html'],
+    ['lint', 'images', 'fonts', 'html'],
    'vulcanize', // 'cache-config',
    cb);
});
```

