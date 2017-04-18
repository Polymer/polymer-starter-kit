/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _    = require('lodash');
var path = require('path');

// Plugin module names can be prefixed by the following:
var PREFIXES = [
  'web-component-tester-',
  'wct-',
];

/**
 * A WCT plugin. This constructor is private. Plugins can be retrieved via
 * `Plugin.get`.
 */
function Plugin(packageName, metadata) {
  this.name        = Plugin.shortName(packageName);
  this.packageName = packageName;
  this.metadata    = metadata;

  this.cliConfig = this.metadata['cli-options'] || {};
}

/**
 * @param {!Context} context The context that this plugin should be evaluated
 *     within.
 * @param {function(*)} done
 */
Plugin.prototype.execute = function execute(context, done) {
  try {
    require(this.packageName)(context, context.pluginOptions(this.name), this);
  } catch (error) {
    return done('Failed to load plugin "' + this.name + '": ' + error);
  }
  done();
};

// Plugin Loading

// We maintain an identity map of plugins, keyed by short name.
var _loadedPlugins = {};

/**
 * Retrieves a plugin by shorthand or module name (loading it as necessary).
 *
 * @param {string} name
 * @param {function(*, Plugin)} done
 */
Plugin.get = function get(name, done) {
  var shortName = Plugin.shortName(name);
  if (_loadedPlugins[shortName]) return done(null, _loadedPlugins[shortName]);

  var names  = [shortName].concat(PREFIXES.map(function(p) {return p + shortName;}));
  var loaded = _.compact(names.map(_tryLoadPluginPackage));
  if (loaded.length > 1) {
    var prettyNames = loaded.map(function(p) { return p.packageName }).join(' ');
    done('Loaded conflicting WCT plugin packages: ' + prettyNames);
  } else if (loaded.length < 1) {
    done('Could not find WCT plugin named "' + name + '"');
  } else {
    done(null, loaded[0]);
  }
};

/**
 * @param {string} name
 * @return {string} The short form of `name`.
 */
Plugin.shortName = function(name) {
  for (var i = 0, prefix; prefix = PREFIXES[i]; i++) {
    if (name.indexOf(prefix) === 0) {
      return name.substr(prefix.length);
    }
  }
  return name;
};

/**
 * @param {string} packageName Attempts to load a package as a WCT plugin.
 * @return {Plugin}
 */
function _tryLoadPluginPackage(packageName) {
  var packageInfo;
  try {
    packageInfo = require(path.join(packageName, 'package.json'));
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      console.log(error);
    }
    return null;
  }

  // Plugins must have a (truthy) wct-plugin field.
  if (!packageInfo['wct-plugin']) return null;
  // Allow {"wct-plugin": true} as a shorthand.
  var metadata = _.isObject(packageInfo['wct-plugin']) ? packageInfo['wct-plugin'] : {};

  return new Plugin(packageName, metadata);
}

// Looks like Plugin, but not really.
module.exports = Plugin;
