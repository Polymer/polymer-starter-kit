# Add ESLint support

This recipe helps you to create a task to use [ESLint](http://eslint.org/) tool. 


## Create .eslintrc.json file in the root folder

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
    "__dirname": false,
    "app": false,
    "page": false,
    "Polymer": false,
    "process": false,
    "require": false
  }
}
```

## Create .eslintignore file in the root folder

```
/app/bower_components/**
/dist/**
```


## Create a lint gulp task

- Install the gulp-eslint and eslint-plugin-html: `npm install --save-dev gulp-eslint eslint-plugin-html`
- Add the following gulp task in the `gulpfile.js` file:

```patch

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
-gulp.task('serve', ['styles'], function () {
+gulp.task('serve', ['lint', 'styles'], function () {

  ...

  gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
+ gulp.watch(['app/{scripts,elements}/**/{*.js,*.html}'], ['lint', reload]);
  gulp.watch(['app/images/**/*'], reload);
});
```

 - In the `default` task make sure `lint` is run in parallel to `images`, `fonts` and `html`:

```patch
gulp.task('default', ['clean'], function (cb) {

  ...

  runSequence(
    ['copy', 'styles'],
-   ['images', 'fonts', 'html'],
+   ['lint', 'images', 'fonts', 'html'],
    'vulcanize', // 'cache-config',
    cb);
});
```

