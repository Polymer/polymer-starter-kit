/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';

var interruptHandlers = [];
// Register a handler to occur on SIGINT. All handlers are passed a callback,
// and the process will be terminated once all handlers complete.
function onInterrupt(handler) {
  interruptHandlers.push(handler);
}

// Call all interrupt handlers, and call the callback when they all complete.
function close(done) {
  var numComplete = 0;
  // You could cheat by calling callbacks multiple times, but that's your bug!
  var total = interruptHandlers.length;
  interruptHandlers.forEach(function(handler) {
    handler(function() {
      numComplete = numComplete + 1;
      if (numComplete === total) done();
    });
  });
  interruptHandlers = [];
}

var interrupted = false;
// Behaves as if you sent a SIGINT to the process.
function interrupt() {
  if (interruptHandlers.length === 0) return process.exit();
  if (interrupted) {
    console.log('\nKilling process with extreme prejudice');
    return process.exit(1);
  } else {
    interrupted = true;
  }

  close(process.exit.bind(process));
  console.log('\nShutting down. Press ctrl-c again to kill immediately.');
}
process.on('SIGINT', interrupt);

module.exports.close       = close;
module.exports.interrupt   = interrupt;
module.exports.onInterrupt = onInterrupt;
