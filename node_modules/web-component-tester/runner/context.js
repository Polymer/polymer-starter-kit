/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var _      = require('lodash');
var async  = require('async');
var events = require('events');
var util   = require('util');

var config = require('./config');
var Plugin = require('./plugin');

/**
 * Exposes the current state of a WCT run, and emits events/hooks for anyone
 * downstream to listen to.
 *
 * @param {Object} options Any initially specified options.
 */
function Context(options) {
  options = options || {};

  /**
   * The configuration for the current WCT run.
   *
   * We guarantee that this object is never replaced (e.g. you are free to hold
   * a reference to it, and make changes to it).
   */
  this.options = config.merge(
    config.defaults(),
    config.fromDisk(options.enforceJsonConf, options.root),
    options
  );

  /** @type {!Object<string, !Array<function>>} */
  this._hookHandlers = {};
}
util.inherits(Context, events.EventEmitter);

// Hooks
//
// In addition to emitting events, a context also exposes "hooks" that
// interested parties can use to inject behavior.

/**
 * Registers a handler for a particular hook. Hooks are typically configured to
 * run _before_ a particular behavior.
 *
 * @param {string} name
 * @param {function(!Object, function(*))} handler
 * @return {!Context}
 */
Context.prototype.hook = function hook(name, handler) {
  this._hookHandlers[name] = this._hookHandlers[name] || [];
  this._hookHandlers[name].unshift(handler);
};

/**
 * Registers a handler that will run after any handlers registered by `hook`.
 *
 * @param {string} name
 * @param {function(!Object, function(*))} handler
 * @return {!Context}
 */
Context.prototype.hookLate = function hookLate(name, handler) {
  this._hookHandlers[name] = this._hookHandlers[name] || [];
  this._hookHandlers[name].push(handler);
};

/**
 * Once all registered handlers have run for the hook, your callback will be
 * triggered. If any of the handlers indicates an error state, any subsequent
 * handlers will be canceled, and the error will be passed to the callback for
 * the hook.
 *
 * Any additional arguments passed between `name` and `done` will be passed to
 * hooks (before the callback).
 *
 * @param {string} name
 * @param {function(*)} done
 * @return {!Context}
 */
Context.prototype.emitHook = function emitHook(name, done) {
  this.emit('log:debug', 'hook:', name);

  var hooks = (this._hookHandlers[name] || []);
  if (arguments.length > 2) {
    var hookArgs = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
    done = arguments[arguments.length - 1];  // mutates arguments in loose mode!
    hooks = hooks.map(function(hook) {
      return hook.bind.apply(hook, [null].concat(hookArgs));
    });
  }

  // We execute the handlers _sequentially_. This may be slower, but it gives us
  // a lighter cognitive load and more obvious logs.
  async.series(hooks, function(error) {
    if (error) {
      this.emit('log:debug', 'hook done:', name, 'with error:', error);
    } else {
      this.emit('log:debug', 'hook done:', name);
    }
    done(error);
  }.bind(this));

  return this;
};

/**
 * @param {function(*, Array<!Plugin>)} done Asynchronously loads the plugins
 *     requested by `options.plugins`.
 */
Context.prototype.plugins = function plugins(done) {
  async.map(this.enabledPlugins(), Plugin.get, done);
};

/**
 * @return {!Array<string>} The names of enabled plugins.
 */
Context.prototype.enabledPlugins = function enabledPlugins() {
  // Plugins with falsy configuration or disabled: true are _not_ loaded.
  var pairs = _.reject(_.pairs(this.options.plugins), function(p) { return !p[1] || p[1].disabled });
  return _.map(pairs, function(p) { return p[0] });
};

/**
 * @param {string} name
 * @return {!Object}
 */
Context.prototype.pluginOptions = function pluginOptions(name) {
  return this.options.plugins[Plugin.shortName(name)];
};

module.exports = Context;
