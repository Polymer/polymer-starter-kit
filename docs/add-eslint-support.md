# Add ESLint support

This recipe helps you to create a task to use [ESLint](http://eslint.org/) tool. 


## Create .eslintrc file in the root folder

```
{
  "extends": "eslint:recommended",
  "rules": {
    "no-console": 0
  },
  "env": {
    "browser": true
  },
  "plugins": [
    "html"
  ],
  "globals": {
    "Polymer": false
  }
}
```

## Create .eslintignore file in the root folder

```
node_modules/*
bower_components/*
```


## Create a lint gulp task

- Install the gulp-eslint and eslint-plugin-html: `npm install --save-dev gulp-eslint eslint-plugin-html`
- Add the following gulp task in the `gulpfile.js` file:

```patch

+ var eslint = require('gulp-eslint');

...

+ // Lint JavaScript
+ gulp.task('lint', function() {
+   return gulp.src([
+       'app/scripts/**/*.js',
+       'app/elements/**/*.html',
+       'gulpfile.js'
+     ])
+     .pipe(reload({
+       stream: true,
+       once: true
+     }))
+     .pipe($.eslint())
+     .pipe($.eslint.format())
+     .pipe($.eslint.failAfterError());
+ });
```

This task will check all JS files and JS inside HTML files.


## Integrating the lint task

Make sure the `lint` gulp task is triggered by the common build tasks:

 - In the gulp `serve` task, make sure `lint` is triggered initially and on HTML and JS files changes:

```patch
-gulp.task('serve', ['styles', 'elements', 'images'], function () {
+gulp.task('serve', ['lint', 'styles', 'elements', 'images'], function () {

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

