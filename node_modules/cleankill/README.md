# Cleankill

CleanKill hooks the interrupt handler, and provides callbacks for your code to cleanly shut down before the process exits.

As an escape hatch, if the user mashes interrupt, the process will be immediately killed.

## Using It

```js
var cleankill = require('cleankill');
```

To register a handler:

```js
cleankill.onInterrupt(function(done) {
  // do things.
  done();
});
```

If you wish to shut down any existing handlers (without exiting the process):

```js
cleankill.close(function() {
  // All handlers have cleaned things up.
});
```
