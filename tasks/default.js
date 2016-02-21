var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var path = require('path');
var historyApiFallback = require('connect-history-api-fallback');

module.exports = {
  dist: function(subpath){
    return !subpath ? 'dist' : path.join('dist', subpath);
  },
  assets: $.useref.assets({
    searchPath: ['app', 'dist']
  }),
  server: {
    baseDir: ['.tmp', 'app'],
    middleware: [historyApiFallback()]
  },
  // assets: $.useref.assets(),
  // Note: this uses an unsigned certificate which on first access
  //       will present a certificate warning in the browser.
  https: false,
  watch: function(){
    gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
    gulp.watch(['app/elements/**/*.css'], ['elements', reload]);
    gulp.watch(['app/scripts/**/*.js'], reload);
    gulp.watch(['app/images/**/*'], reload);
  },
  default: function(cb) {
    // Uncomment 'cache-config' if you are going to use service workers.
    runSequence(
        ['ensureFiles', 'copy', 'styles'],
        'elements',
        ['images', 'fonts', 'html'],
        'vulcanize', // 'cache-config',
        cb);
  }
};
