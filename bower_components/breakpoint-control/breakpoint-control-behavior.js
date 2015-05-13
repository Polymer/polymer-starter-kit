(function(root, factory) {
  'use strict';

  if (typeof module === 'object') {
    module.exports = factory();
  } else if (typeof window === 'object') {
    var Polymer = window.Polymer || {};
    Polymer.Core =  Polymer.Core || {};
    Polymer.Core.BreakpointControl = factory();
  } else {
    throw new ReferenceError('[breakpoint-control-mixin] unknown environment');
  }

}(this, function() {
  'use strict';

  var detectedPlatform = null;
  var PLATFORM = {
    PHONE: 1,
    TABLET: 2,
    TV: 3,
    DESKTOP: 4,
    UNKNOWN: 5
  };

  /**
   * Gets the current platform name
   */
  function getPlatformFromUserAgent(ua) {
    var tv = ua.match(/TV|CrKey/i);
    var tablet = ua.match(/iPad|tablet|Silk|Nexus (10|9|7)/i);
    var phone = ua.match(/iPhone|iPod|Phone|Android/i);
    var desktop = ua.match(/Macintosh|Windows|Linux|X11|Win/i) && !phone && !tablet;

    if (desktop) {
      return PLATFORM.DESKTOP;
    }

    if (phone) {
      return PLATFORM.PHONE;
    }

    if (tablet) {
      return PLATFORM.TABLET;
    }

    if (tv) {
      return PLATFORM.TV;
    }

    return PLATFORM.UNKNOWN;
  }

  /**
   *
   */
  function getPlatform()  {
    if (detectedPlatform === null) {
      detectedPlatform = getPlatformFromUserAgent(navigator.userAgent);
    }
    return detectedPlatform;
  }

  /**
   * @ref https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
   */
  function isTouch() {
    return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
  }


  var mqBuilderProto = {
    all: function() {
      if (this.enabled) {
        this.queries.push('all');
      }
      return this;
    },

    portrait: function() {
      if (this.enabled) {
        this.queries.push('(orientation: portrait)');
      }
      return this;
    },

    landscape: function() {
      if (this.enabled) {
        this.queries.push('(orientation: landscape)');
      }
      return this;
    },

    max: function(value) {
      if (this.enabled) {
        this.priority = value;
        this.queries.push('(max-width: ' + value + 'px)');
      }
      return this;
    },

    min: function(value) {
      if (this.enabled) {
        this.queries.push('(min-width: ' + value + 'px)');
      }
      return this;
    },

    minRatio: function(ratio) {
      if (this.enabled) {
        this.queries.push('(min-aspect-ratio: ' + ratio + ')');
      }
      return this;
    },

    maxRatio: function(ratio) {
      if (this.enabled) {
        this.queries.push('(max-aspect-ratio: ' + ratio + ')');
      }
      return this;
    },

    phone: function() {
      if (getPlatform() !== PLATFORM.PHONE) {
        this.enabled = false;
      }
      return this;
    },

    tablet: function() {
      if (getPlatform() !== PLATFORM.TABLET) {
        this.enabled = false;
      }
      return this;
    },

    desktop: function() {
      if (getPlatform() !== PLATFORM.DESKTOP) {
        this.enabled = false;
      }
      return this;
    },

    tv: function() {
      if (getPlatform() !== PLATFORM.TV) {
        this.enabled = false;
      }
      return this;
    },

    touch: function() {
      if (!isTouch()) {
        this.enabled = false;
      }
      return this;
    },

    merge: function() {
      return this.enabled ? this.queries.join(' and ') : null;
    }
  };

  return {
    /**
     *
     */

    _context: null,

    _boundQueryHandler: null,
    /**
     *
     */
    _listener: function() {

    },

    /**
     *
     */
    all: function() {
      var properties = {
        queries: {
          writable: true,
          value: []
        },

        enabled: {
          writable: true,
          value: true
        },

        priority: {
          writable: true,
          value: 100000
        }
      };
      return Object.create(mqBuilderProto, properties).all();
    },

    /**
     *
     */
    _registerBreakpoints: function(queries) {
      if (!this._context || !this._context.queryManager || !this._context.breakpoints) {
        throw new TypeError('[breakpoint-control-mixin] A context must be defined');
      }

      var breakpoints = Object.keys(queries);

      if (this._boundQueryHandler === null) {
        this._boundQueryHandler = this._queryHandler.bind(this);
      }

      breakpoints.forEach(function(breakpoint) {
        var mm;
        var mq = queries[breakpoint].merge();

        if (mq) {
          mm = window.matchMedia(mq);
          mm.addListener(this._boundQueryHandler);

          this._context.queryManager[breakpoint] = mm;
          this._context.breakpoints.push(breakpoint);
        }
      }, this);

      // sort to preserve the priority where a <= b
      this._context.breakpoints.sort(function(a, b) {
        return queries[a].priority - queries[b].priority;
      });

      this._boundQueryHandler();
    },

    /**
     *
     */
    _setListener: function(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('[breakpoint-control-mixin] `listener` must be a function');
      }
      this._listener = listener;
    },

    /**
     *
     */
    _setContext: function(context) {
      this._context = context;
    },

    /**
     *
     */
    _queryHandler: function() {
      if (this._context.locked) {
        return;
      }
      //Polymer.Base.debounce
      var breakpoints = this._context.breakpoints;
      var queryManager = this._context.queryManager;

      // call the active
      for (var i = 0, len = breakpoints.length; i < len; i++) {
        if (queryManager[breakpoints[i]].matches) {

          // prevent race conditions
          this._context.locked = true;
          this._listener(breakpoints[i]);
          // release the lock
          setTimeout(function() {
            this._context.locked  = false;
          }.bind(this), 0);
          break;
        }
      }
    }
  };

}));
