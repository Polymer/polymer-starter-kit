/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {
  'use strict';

  var HAS_NEW_MOUSE = (function() {
    var has = false;
    try {
      has = Boolean(new MouseEvent('x'));
    } catch (_) {}
    return has;
  })();

  function middleOfNode(node) {
    var bcr = node.getBoundingClientRect();
    return {
      y: bcr.top + (bcr.height / 2),
      x: bcr.left + (bcr.width / 2)
    };
  }

  function topLeftOfNode(node) {
    var bcr = node.getBoundingClientRect();
    return {
      y: bcr.top,
      x: bcr.left
    };
  }

  function makeEvent(type, xy, node) {
    var props = {
      bubbles: true,
      cancelable: true,
      clientX: xy.x,
      clientY: xy.y,
      // Make this a primary input.
      buttons: 1 // http://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    };
    var e;
    var mousetype = type === 'tap' ? 'click' : 'mouse' + type;
    if (HAS_NEW_MOUSE) {
      e = new MouseEvent(mousetype, props);
    } else {
      e = document.createEvent('MouseEvent');
      e.initMouseEvent(
        mousetype, props.bubbles, props.cancelable,
        null, /* view */
        null, /* detail */
        0,    /* screenX */
        0,    /* screenY */
        props.clientX, props.clientY,
        false, /*ctrlKey */
        false, /*altKey */
        false, /*shiftKey */
        false, /*metaKey */
        0,     /*button */
        null   /*relatedTarget*/);
    }
    node.dispatchEvent(e);
  }

  function down(node, xy) {
    xy = xy || middleOfNode(node);
    makeEvent('down', xy, node);
  }

  function move(node, fromXY, toXY, steps) {
    steps = steps || 5;
    var dx = Math.round((fromXY.x - toXY.x) / steps);
    var dy = Math.round((fromXY.y - toXY.y) / steps);
    var xy = {
      x: fromXY.x,
      y: fromXY.y
    };
    for (var i = steps; i > 0; i--) {
      makeEvent('move', xy, node);
      xy.x += dx;
      xy.y += dy;
    }
    makeEvent('move', {
      x: toXY.x,
      y: toXY.y
    }, node);
  }

  function up(node, xy) {
    xy = xy || middleOfNode(node);
    makeEvent('up', xy, node);
  }

  function tap(node) {
    // Respect nodes that are disabled in the UI.
    if (window.getComputedStyle(node)['pointer-events'] === 'none')
      return;
    var xy = middleOfNode(node);
    down(node, xy);
    up(node, xy);
    makeEvent('tap', xy, node);
  }

  function focus(target) {
    Polymer.Base.fire('focus', {}, {
      bubbles: false,
      node: target
    });
  }

  function blur(target) {
    Polymer.Base.fire('blur', {}, {
      bubbles: false,
      node: target
    });
  }

  function downAndUp(target, callback) {
    down(target);
    Polymer.Base.async(function() {
      up(target);
      tap(target);

      callback && callback();
    });
  }

  function track(target, dx, dy, steps) {
    dx = dx | 0;
    dy = dy | 0;
    steps = steps || 5;
    down(target);
    var xy = middleOfNode(target);
    var xy2 = {
      x: xy.x + dx,
      y: xy.y + dy
    };
    move(target, xy, xy2, steps);
    up(target, xy2);
  }

  function keyboardEventFor(type, keyCode) {
    var event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true
    });

    event.keyCode = keyCode;
    event.code = keyCode;

    return event;
  }

  function keyEventOn(target, type, keyCode) {
    target.dispatchEvent(keyboardEventFor(type, keyCode));
  }

  function keyDownOn(target, keyCode) {
    keyEventOn(target, 'keydown', keyCode);
  }

  function keyUpOn(target, keyCode) {
    keyEventOn(target, 'keyup', keyCode);
  }

  function pressAndReleaseKeyOn(target, keyCode) {
    keyDownOn(target, keyCode);
    Polymer.Base.async(function() {
      keyUpOn(target, keyCode);
    }, 1);
  }

  function pressEnter(target) {
    pressAndReleaseKeyOn(target, 13);
  }

  function pressSpace(target) {
    pressAndReleaseKeyOn(target, 32);
  }

  global.MockInteractions = {
    focus: focus,
    blur: blur,
    down: down,
    up: up,
    downAndUp: downAndUp,
    tap: tap,
    track: track,
    pressAndReleaseKeyOn: pressAndReleaseKeyOn,
    pressEnter: pressEnter,
    pressSpace: pressSpace,
    keyDownOn: keyDownOn,
    keyUpOn: keyUpOn,
    middleOfNode: middleOfNode,
    topLeftOfNode: topLeftOfNode
  };
})(this);
