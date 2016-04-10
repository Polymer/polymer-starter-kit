[![Build status](https://travis-ci.org/PolymerElements/iron-test-helpers.svg?branch=master)](https://travis-ci.org/PolymerElements/iron-test-helpers)

# iron-test-helpers

A set of utility classes to make testing easier. For more details on the methods
available, please check the documentation of `mock-interactions.js` and
`test-helpers.js`

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
