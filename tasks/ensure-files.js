'use strict';
var fs = require('fs');

var gulp = require('gulp');
var path = require('path');

/**
 * @param {Array<string>} files
 * @param {Function} cb
 */

function ensureFiles(files, cb) {
  var missingFiles = files.reduce(function(prev, filePath) {
    var fileFound = false;

    try {
      fileFound = fs.statSync(filePath).isFile();
    } catch (e) { }

    if (!fileFound) {
      prev.push(filePath + ' Not Found');
    }

    return prev;
  }, []);

  if (missingFiles.length) {
    var err = new Error('Missing Required Files\n' + missingFiles.join('\n'));
  }

  if (cb) {
    cb(err);
  } else if (err) {
    throw err;
  }
}

// Ensure that we are not missing required files for the project
// "dot" files are specifically tricky due to them being hidden on
// some systems.
gulp.task('ensureFiles', function(cb) {
  var requiredFiles = ['../.bowerrc'];

  ensureFiles(requiredFiles.map(function(p) {
    return path.join(__dirname, p);
  }), cb);
});

module.exports = ensureFiles;
