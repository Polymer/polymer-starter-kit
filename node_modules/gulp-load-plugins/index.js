'use strict';
var multimatch = require('multimatch');
var findup = require('findup-sync');
var path = require('path');
var resolve = require('resolve');
var gutil = require('gulp-util');

function arrayify(el) {
  return Array.isArray(el) ? el : [el];
}

function camelize(str) {
  return str.replace(/-(\w)/g, function(m, p1) {
    return p1.toUpperCase();
  });
}

module.exports = function(options) {
  var finalObject = {};
  var configObject;
  var requireFn;
  options = options || {};

  var DEBUG = options.DEBUG || false;
  var pattern = arrayify(options.pattern || ['gulp-*', 'gulp.*', '@*/gulp{-,.}*']);
  var config = options.config || findup('package.json', {cwd: parentDir});
  var scope = arrayify(options.scope || ['dependencies', 'devDependencies', 'peerDependencies']);
  var replaceString = options.replaceString || /^gulp(-|\.)/;
  var camelizePluginName = options.camelize !== false;
  var lazy = 'lazy' in options ? !!options.lazy : true;
  var renameObj = options.rename || {};

  logDebug('Debug enabled with options: ' + JSON.stringify(options));

  var renameFn = options.renameFn || function (name) {
    name = name.replace(replaceString, '');
    return camelizePluginName ? camelize(name) : name;
  };

  if(typeof options.requireFn === 'function') {
    requireFn = options.requireFn;
  } else if(typeof config === 'string') {
    requireFn = function (name) {
      // This searches up from the specified package.json file, making sure
      // the config option behaves as expected. See issue #56.
      var src = resolve.sync(name, { basedir: path.dirname(config) });
      return require(src);
    };
  } else {
    requireFn = require;
  }

  configObject = (typeof config === 'string') ? require(config) : config;

  if(!configObject) {
    throw new Error('Could not find dependencies. Do you have a package.json file in your project?');
  }

  var names = scope.reduce(function(result, prop) {
    return result.concat(Object.keys(configObject[prop] || {}));
  }, []);

  logDebug(names.length + ' plugin(s) found: ' + names.join(' '));

  pattern.push('!gulp-load-plugins');

  function logDebug(message) {
    if(DEBUG) {
      gutil.log(gutil.colors.green('gulp-load-plugins: ' + message));
    }
  }

  function defineProperty(object, requireName, name) {
    if(object[requireName]){
      logDebug('error: defineProperty ' + name);
      throw new Error('Could not define the property \"' + requireName + '\", you may have repeated dependencies in your package.json like' + ' "gulp-' + requireName + '" and ' + '"' + requireName + '"' );
    }

    if(lazy) {
      logDebug('lazyload: adding property ' + requireName);
      Object.defineProperty(object, requireName, {
        get: function() {
          logDebug('lazyload: requiring ' + name + '...');
          return requireFn(name);
        }
      });
    } else {
      logDebug('requiring ' + name + '...');
      object[requireName] = requireFn(name);
    }
  }

  function getRequireName(name) {
    var requireName;

    if(renameObj[name]) {
      requireName = options.rename[name];
    } else {
      requireName = renameFn(name);
    }

    logDebug('renaming ' + name + ' to ' + requireName);

    return requireName;
  }

  var scopeTest = new RegExp('^@');
  var scopeDecomposition = new RegExp('^@(.+)/(.+)');

  multimatch(names, pattern).forEach(function(name) {
    if(scopeTest.test(name)) {
      var decomposition = scopeDecomposition.exec(name);

      if(!finalObject.hasOwnProperty(decomposition[1])) {
        finalObject[decomposition[1]] = {};
      }

      defineProperty(finalObject[decomposition[1]], getRequireName(decomposition[2]), name);
    } else {
      defineProperty(finalObject, getRequireName(name), name);
    }

  });

  return finalObject;
};

var parentDir = path.dirname(module.parent.filename);

// Necessary to get the current `module.parent` and resolve paths correctly.
delete require.cache[__filename];
