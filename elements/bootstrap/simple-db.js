/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// From https://gist.github.com/inexorabletash/c8069c042b734519680c (Joshua Bell)

(function(global) {
  var SECRET = Object.create(null);
  var DB_PREFIX = '$SimpleDB$';
  var STORE = 'store';

  // Chrome iOS has window.indexeDB, but it is null.
  if (!(global.indexedDB && indexedDB.open)) {
    return;
  }

  function SimpleDBFactory(secret) {
    if (secret !== SECRET) throw TypeError('Invalid constructor');
  }
  SimpleDBFactory.prototype = {
    open: function(name) {
      return new Promise(function(resolve, reject) {
        var request = indexedDB.open(DB_PREFIX + name);
        request.onupgradeneeded = function() {
          var db = request.result;
          db.createObjectStore(STORE);
        };
        request.onsuccess = function() {
          var db = request.result;
          resolve(new SimpleDB(SECRET, name, db));
        };
        request.onerror = function() {
          reject(request.error);
        };
      });
    },
    delete: function(name) {
      return new Promise(function(resolve, reject) {
        var request = indexedDB.deleteDatabase(DB_PREFIX + name);
        request.onsuccess = function() {
          resolve(undefined);
        };
        request.onerror = function() {
          reject(request.error);
        };
      });
    }
  };

  function SimpleDB(secret, name, db) {
    if (secret !== SECRET) throw TypeError('Invalid constructor');
    this._name = name;
    this._db = db;
  }
  SimpleDB.cmp = indexedDB.cmp;
  SimpleDB.prototype = {
    get name() {
      return this._name;
    },
    get: function(key) {
      var that = this;
      return new Promise(function(resolve, reject) {
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        var req = store.get(key);
        // NOTE: Could also use req.onsuccess/onerror
        tx.oncomplete = function() { resolve(req.result); };
        tx.onabort = function() { reject(tx.error); };
      });
    },
    set: function(key, value) {
      var that = this;
      return new Promise(function(resolve, reject) {
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        var req = store.put(value, key);
        tx.oncomplete = function() { resolve(undefined); };
        tx.onabort = function() { reject(tx.error); };
      });
    },
    delete: function(key) {
      var that = this;
      return new Promise(function(resolve, reject) {
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        var req = store.delete(key);
        tx.oncomplete = function() { resolve(undefined); };
        tx.onabort = function() { reject(tx.error); };
      });
    },
    clear: function() {
      var that = this;
      return new Promise(function(resolve, reject) {
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        var request = store.clear();
        tx.oncomplete = function() { resolve(undefined); };
        tx.onabort = function() { reject(tx.error); };
      });
    },
    forEach: function(callback, options) {
      var that = this;
      return new Promise(function(resolve, reject) {
        options = options || {};
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        var request = store.openCursor(
          options.range,
          options.direction === 'reverse' ? 'prev' : 'next');
        request.onsuccess = function() {
          var cursor = request.result;
          if (!cursor) return;
          try {
            var terminate = callback(cursor.key, cursor.value);
            if (!terminate) cursor.continue();
          } catch (ex) {
            tx.abort(); // ???
          }
        };
        tx.oncomplete = function() { resolve(undefined); };
        tx.onabort = function() { reject(tx.error); };
      });
    },
    getMany: function(keys) {
      var that = this;
      return new Promise(function(resolve, reject) {
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        var results = [];
        keys.forEach(function(key) {
          store.get(key).onsuccess(function(result) {
            results.push(result);
          });
        });
        tx.oncomplete = function() { resolve(results); };
        tx.onabort = function() { reject(tx.error); };
      });
    },
    setMany: function(entries) {
      var that = this;
      return new Promise(function(resolve, reject) {
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        entries.forEach(function(entry) {
          store.put(entry.value, entry.key);
        });
        tx.oncomplete = function() { resolve(undefined); };
        tx.onabort = function() { reject(tx.error); };
      });
    },
    deleteMany: function(keys) {
      var that = this;
      return new Promise(function(resolve, reject) {
        var tx = that._db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        keys.forEach(function(key) {
          store.delete(key);
        });
        tx.oncomplete = function() { resolve(undefined); };
        tx.onabort = function() { reject(tx.error); };
      });
    }
  };

  global.simpleDB = new SimpleDBFactory(SECRET);
  global.SimpleDBKeyRange = IDBKeyRange;
}(self));
