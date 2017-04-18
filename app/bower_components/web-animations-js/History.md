### 2.1.4 - *December 1 2015*
  * Use `Date.now()` instead of `performace.now()` for mobile Safari.

### 2.1.3 - *October 12 2015*
  * Removed web-animations.min.js.gz

### 2.1.2 - *July 8 2015*
  * Fix a bug where onfinish was being called for GroupEffects before they were finished.

### 2.1.1 - *July 1 2015*
  * Add Animation.timeline getter
  * Add AnimationEffect.parent getter
  * Make AnimationEffectTiming (returned by AnimationEffect.timing) attributes mutable
  * Expose the Animation constructor
  * Change custom effects from AnimationEffects to onsample functions. Custom effects should now be created by setting the onsample attribute of a KeyframeEffect.

    For example, this is deprecated:

        var myEffect = new KeyframeEffect(
           element,
           function(timeFraction, target, effect) {
              target.style.opacity = timeFraction;
           },
           1000);
        var myAnimation = document.timeline.play(myEffect);

    and this should be used insead:

        var myEffect = new KeyframeEffect(element, [], 1000);
        effect.onsample = function(timeFraction, effect, animation) {
           effect.target.style.opacity = timeFraction;
        };
        var myAnimation = document.timeline.play(myEffect);

### 2.1.0 - *June 15 2015*
  * Fix bug affecting GroupEffects with infinite iteration children
  * Add GroupEffect.firstChild and GroupEffect.lastChild
  * Add initial values for most CSS properties
  * Allow `timeline.play()` to be called with no arguments
  * Add AnimationEffect.clone
  * Add GroupEffect.append and GroupEffect.prepend
  * Add AnimationEffect.remove
  * Add Animation.ready and Animation.finished promises

### 2.0.0 - *April 5 2015*

  * Improve behavior of group Animation playback rate.
  * Rename Animation to KeyframeEffect.
  * Rename AnimationSequence to SequenceEffect.
  * Rename AnimationGroup to GroupEffect.
  * Rename AnimationPlayer to Animation.
  * Remove KeyframeEffect.effect and add KeyframeEffect.getFrames.
  * Rename Animation.source to Animation.effect.
  * Rename Timeline.getAnimationPlayers to Timeline.getAnimations.
  * Rename Element.getAnimationPlayers to Element.getAnimations.

### 1.0.7 - *March 10 2015*

  * Improve performance of constructing groups and sequences.
  * Remove support for animating zoom.
  * Add bower file.

### 1.0.6 - *February 5 2015*

  * Implement playbackRate setter for group players.
  * Fix pausing a group player before its first tick.
  * Fix cancelling a group player before its first tick.
  * Fix excess CPU use on idle pages where custom effects and groups were used.
  * Suppress AnimationTiming.playbackRate deprecation warning for cases where AnimationTiming.playbackRate == 1.

### 1.0.5 - *January 6 2015*

  * Fix loading the polyfill in an SVG document
  * Fix a problem where groups didn't take effect in their first frame
  * Don't rely on performance.now

### 1.0.4 - *December 8 2014*

  * Fix a critical bug where deprecation logic wasn't being loaded
    when `web-animations-next` and `web-animations-next-lite` were
    executed on top of a native `element.animate`.

### 1.0.3 - *December 4 2014*

  * Fix a critical bug on iOS 7 and Safari <= 6. Due to limitations,
    inline style patching is not supported on these platforms.

### 1.0.2 - *November 28 2014*

  * Deprecated `AnimationTiming.playbackRate`.

    For example, this is no longer supported:

        var player = element.animate(
            keyframes,
            {duration: 1000, playbackRate: 2});

    Use `AnimationPlayer.playbackRate` instead:

        var player = element.animate(
            keyframes,
            {duration: 1000});
        player.playbackRate = 2;

    If you have any feedback on this change, please start a discussion
    on the public-fx mailing list:
    http://lists.w3.org/Archives/Public/public-fx/

    Or file an issue against the specification on GitHub:
    https://github.com/w3c/web-animations/issues/new

### 1.0.1 - *November 26 2014*

  * Players should be constructed in idle state
  * `play()` and `reverse()` should not force a start times
  * Add `requestAnimationFrame` ids and `cancelAnimationFrame`

### 1.0.0 — *November 21 2014*

  The web-animations-js hackers are pleased to announce the release of
  a new codebase for the Web Animations Polyfill:
  https://github.com/web-animations/web-animations-js

  The previous polyfill has been moved to:
  https://github.com/web-animations/web-animations-js-legacy

  The new codebase is focused on code-size -- our smallest target is
  now only 33kb or 11kb after gzip.

  We've implemented native fallback. If the target browser provides
  Web Animations features natively, the Polyfill will use them.

  We now provide three different build targets:

  `web-animations.min.js` - Tracks the Web Animations features that
  are supported natively in browsers. Today that means Element.animate
  and Playback Control in Chrome. If you’re not sure what features you
  will need, start with this.

  `web-animations-next.min.js` - All of web-animations.min.js plus
  features that are still undergoing discussion or have yet to be
  implemented natively.

  `web-animations-next-lite.min.js` - A cut down version of
  web-animations-next, removes several lesser used property handlers
  and some of the larger and less used features such as matrix
  interpolation/decomposition.

  Not all features of the previous polyfill have been ported to the
  new codebase; most notably mutation of Animations and Groups and
  Additive Animations are not yet supported. These features are still
  important and will be implemented in the coming weeks.
