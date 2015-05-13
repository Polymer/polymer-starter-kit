(function(global) {
  'use strict';

  function focus (target) {
    Polymer.Base.fire.call(target, 'focus');
  }

  function blur (target) {
    Polymer.Base.fire.call(target, 'blur');
  }

  function down (target) {
    Polymer.Base.fire.call(target, 'mousedown');
  }

  function up (target) {
    Polymer.Base.fire.call(target, 'mouseup');
  }

  function tap(target) {
    Polymer.Base.fire.call(target, 'tap');
  }

  function downAndUp (target, callback) {
    down(target);
    Polymer.Base.async(function() {
      up(target);
      tap(target);

      callback && callback();
    });
  }

  function keyboardEventFor (type, keyCode) {
    var event = new CustomEvent(type);

    event.keyCode = keyCode;
    event.code = keyCode;

    return event;
  }

  function keyEventOn (target, type, keyCode) {
    target.dispatchEvent(keyboardEventFor(type, keyCode));
  }

  function keyDownOn (target, keyCode) {
    keyEventOn(target, 'keydown', keyCode);
  }

  function keyUpOn (target, keyCode) {
    keyEventOn(target, 'keyup', keyCode);
  }

  function pressAndReleaseKeyOn (target, keyCode) {
    keyDownOn(target, keyCode);
    Polymer.Base.async(function () {
      keyUpOn(target, keyCode);
    }, 1);
  }

  function pressEnter (target) {
    pressAndReleaseKeyOn(target, 13);
  }

  function pressSpace (target) {
    pressAndReleaseKeyOn(target, 32);
  }

  global.MockInteractions = {
    focus: focus,
    blur: blur,
    down: down,
    up: up,
    downAndUp: downAndUp,
    pressAndReleaseKeyOn: pressAndReleaseKeyOn,
    pressEnter: pressEnter,
    pressSpace: pressSpace
  };
})(this);
