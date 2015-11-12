# iron-test-helpers

Utility classes to make testing easier.

## Mock Interactions

This is a set of methods to simulate mouse or keyboard interaction with an element. Include `mock-interactions.js` and then use them like so:

```javascript
test('can be triggered with space', function(done) {
  button.addEventListener('keydown', function() {
    done();
  });
  MockInteractions.pressSpace(button);
});

test('can be clicked', function(done) {
  button.addEventListener('click', function() {
    done();
  });
  MockInteractions.tap(button);
});
```
