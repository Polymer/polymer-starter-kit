'use strict';

// Create new element from app/elements/starter-element.html
// syntax: gulp el --new my-element
module.exports = function ($, gulp, parseArgs, replace, fs) { return function () {
  var newName = parseArgs(process.argv.slice(2)).new;
  if (!fs.existsSync('app/elements/' + newName)){
    if ( newName !== undefined && newName !== true && newName.indexOf("-") > 0) {
      var folder = 'app/elements/' + newName;
      var newFile = newName + '.html';
      gulp.src('app/elements/starter-element.html')
        .pipe($.rename(newFile))
        .pipe(replace('starter-element', newName))
        .pipe(gulp.dest(folder));
      console.log('el - created: ', folder + '/' + newFile);
      console.log('el - note: add import to elements.html for ' + newFile );
    } else {
      console.log('el - Bad new element name: ', newName);
      console.log('el - correct syntax: gulp el --new my-element');
    }
  } else {
    console.log('el - folder exits, use different name: ',newName);
  }
};};
