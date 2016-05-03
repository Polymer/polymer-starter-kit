# Add ES2015 support through Babel

Although support for ES2015 (formerly ES6) is improving in modern browsers, the majority do not yet support the full set of features. To benefit from the awesomeness of the new ES2015 syntax while keeping backwards compatibility with Polymer's supported browsers, you'll need to transpile your JS code from ES2015 to ES5

This recipe focuses on adding an ES2015 to ES5 transpile step to Polymer Starter Kit's build pipeline using [BabelJS](https://babeljs.io/).


## Create a transpile gulp task

- Install the gulp Babel, Sourcemap, Crisper plugins and Babel ES2015 preset: `npm install --save-dev gulp-babel gulp-sourcemaps gulp-crisper babel-preset-es2015`
- Add the following gulp task in the `gulpfile.js` file:

```patch
+ // Transpile all JS to ES5.
+ gulp.task('js', function() {
+   return gulp.src(['app/**/*.{js,html}', '!app/bower_components/**/*'])
+    .pipe($.sourcemaps.init())
+    .pipe($.if('*.html', $.crisper({scriptInHead: false}))) // Extract JS from .html files
+    .pipe($.if('*.js', $.babel({
+      presets: ['es2015']
+    })))
+    .pipe($.sourcemaps.write('.'))
+    .pipe(gulp.dest('.tmp/'))
+    .pipe(gulp.dest(dist()));
+ });
```

This task will transpile all JS files and inline JS inside HTML files and also generate sourcemaps. The resulting files are generated in the `.tmp` and the `dist` folders

[Crisper](https://github.com/PolymerLabs/crisper) extracts JavaScript that's inline to HTML files (such as imports). We need this as Babel does not support transpiling HTML files such as `<script>` tags directly

Note: At the time of writing Crisper does not generate the sourcemaps. Your app will work but you won't get sourcemaps for files transformed by Crisper. Relevant issues:

 - [ragingwind/gulp-crisper#4](https://github.com/ragingwind/gulp-crisper/issues/4)
 - [PolymerLabs/crisper#14](https://github.com/PolymerLabs/crisper/issues/14)


## Integrating the transpile task

Make sure the `js` gulp task is triggered by the common build tasks:

 - In the gulp `serve` task, make sure `js` is triggered initially and on HTML and JS files changes:

```patch
- gulp.task('serve', ['styles'], function() {
+ gulp.task('serve', ['styles', 'js'], function() {

  ...

- gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], reload);
+ gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], ['js', reload]);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
- gulp.watch(['app/scripts/**/*.js'], reload);
+ gulp.watch(['app/scripts/**/*.js'], ['js', reload]);
  gulp.watch(['app/images/**/*'], reload);
});
```

 - In the `default` task:

```patch
gulp.task('default', ['clean'], function(cb) {

  ...

  runSequence(
    ['ensureFiles', 'copy', 'styles'],
+   'js',
    'build',
    'vulcanize', // 'cache-config',
    cb);
});
```

 - In the `build` task replace `app` in the paths by `dist` since dist should already contain all JS and HTML files now transpiled.

 ```patch
 // Scan your HTML for assets & optimize them
 gulp.task('build', ['images', 'fonts'], function() {
-  return gulp.src(['app/**/*.html', '!app/{elements,test,bower_components}/**/*.html'])
+  return gulp.src(['dist/**/*.html', '!dist/{elements,test,bower_components}/**/*.html'])

  ...
 ```


## Vulcanize the new files

Need to change the vulcanize command to grab the newly translated files.  .tmp has the translated files so will pull from there.

- First need to copy over all `bower_components` so that vulcanize can find the html references it needs:
```patch
+ // Copy all bower_components over to help js task and vulcanize work together
+ gulp.task('bowertotmp', function() {
+ return gulp.src(['app/bower_components/**/*'])
+   .pipe(gulp.dest('.tmp/bower_components/'));
+ });
```

- Add it to the `default` task:
```patch
gulp.task('default', ['clean'], function(cb) {
  // Uncomment 'cache-config' if you are going to use service workers.
  runSequence(
+   'bowertotmp',
    ['ensureFiles', 'copy', 'styles'],
    'js',
```

- Finally update `vulcanize` task to point to `.tmp` directory:
```patch
gulp.task('vulcanize', function() {
- return gulp.src('app/elements/elements.html')
+ return gulp.src('.tmp/elements/elements.html')
    .pipe($.vulcanize({
      stripComments: true,
```


## Optional - When using shadow-dom instead shady-dom
Place this configuration ([Read more](https://www.polymer-project.org/1.0/docs/devguide/settings.html)) in a separate file like `scripts/polymer-settings`

```html
<script>
    window.Polymer = window.Polymer || {};
    window.Polymer.dom = 'shadow';
</script>
```
