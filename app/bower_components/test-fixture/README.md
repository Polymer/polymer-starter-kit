
<!---

This README is automatically generated from the comments in these files:
test-fixture.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

[![Build status](https://travis-ci.org/PolymerElements/test-fixture.svg?branch=master)](https://travis-ci.org/PolymerElements/test-fixture)


##&lt;test-fixture&gt;

The `<test-fixture>` element can simplify the exercise of consistently
resetting a test suite's DOM. To use it, wrap the test suite's DOM as a template:

```html
<test-fixture id="SomeElementFixture">
  <template>
    <some-element id="SomeElementForTesting"></some-element>
  </template>
</test-fixture>
```

Now, the `<test-fixture>` element can be used to generate a copy of its
template:

```html
<script>
describe('<some-element>', function () {
  var someElement;

  beforeEach(function () {
    document.getElementById('SomeElementFixture').create();
    someElement = document.getElementById('SomeElementForTesting');
  });
});
</script>
```

Fixtured elements can be cleaned up by calling `restore` on the `<test-fixture>`:

```javascript
  afterEach(function () {
    document.getElementById('SomeElementFixture').restore();
    // <some-element id='SomeElementForTesting'> has been removed
  });
```

`<test-fixture>` will create fixtures from all of its immediate `<template>`
children. The DOM structure of fixture templates can be as simple or as complex
as the situation calls for.

## Even simpler usage in Mocha

In Mocha, usage can be simplified even further. Include `test-fixture-mocha.js`
after Mocha in the `<head>` of your document and then fixture elements like so:

```html
<script>
describe('<some-element>', function () {
  var someElement;

  beforeEach(function () {
    someElement = fixture('SomeElementFixture');
  });
});
</script>
```

Fixtured elements will be automatically restored in the `afterEach` phase of the
current Mocha `Suite`.

## Data-bound templates

Data-binding systems are also supported, as long as your (custom) template
elements define a `stamp(model)` method that returns a document fragment. This
allows you to stamp out templates w/ custom models for your fixtures.

For example, using Polymer 0.8's `dom-template`:

```html
<test-fixture id="bound">
  <template is="dom-template">
    <span>{{greeting}}</span>
  </template>
</test-fixture>
```

You can pass an optional context argument to `create()` or `fixture()` to pass
the model:

```js
var bound = fixture('bound', {greeting: 'ohai thurr'});
```

## The problem being addressed

Consider the following `web-component-tester` test suite:

```html
<!doctype html>
<html>
<head>
  <title>some-element test suite</title>

  <link rel="import" href="../some-element.html">
</head>
<body>
  <some-element id="SomeElementForTesting"></some-element>
  <script>
describe('<some-element>', function () {
  var someElement;

  beforeEach(function () {
    someElement = document.getElementById('SomeElementForTesting');
  });

  it('can receive property `foo`', function () {
    someElement.foo = 'bar';
    expect(someElement.foo).to.be.equal('bar');
  });

  it('has a default `foo` value of `undefined`', function () {
    expect(someElement.foo).to.be.equal(undefined);
  });
});
  </script>
</body>
</html>
```

In this contrived example, the suite will pass or fail depending on which order
the tests are run in. It is non-deterministic because `someElement` has
internal state that is not properly reset at the end of each test.

It would be trivial in the above example to simply reset `someElement.foo` to
the expected default value of `undefined` in an `afterEach` hook. However, for
non-contrived test suites that target complex elements, this can result in a
large quantity of ever-growing set-up and tear-down boilerplate.


