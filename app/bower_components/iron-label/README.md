
<!---

This README is automatically generated from the comments in these files:
iron-label.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

[![Build Status](https://travis-ci.org/PolymerElements/iron-label.svg?branch=master)](https://travis-ci.org/PolymerElements/iron-label)

_[Demo and API Docs](https://elements.polymer-project.org/elements/iron-label)_


##&lt;iron-label&gt;

`<iron-label>` provides a version of the `<label>` element that works with Custom Elements as well as native elements.

All text in the `iron-label` will be applied to the target element as a screen-reader accessible description.

There are three ways to use `iron-label` to target an element:

1. place an element inside iron-label and some text:

```html
 <iron-label>
   Label for the Button
   <paper-button>button</paper-button>
 </iron-label>
```


1. place some elements inside iron-label and target one with the `iron-label-target` attribute.
The other elements will provide the label for that element
Note: This is not necessary if the element you want to label is the first
element child of iron-label:

```html
 <iron-label>
   <span>Label for the Button</span>
   <paper-button iron-label-target>button</paper-button>
 </iron-label>

 <iron-label>
   <paper-button>button</paper-button>
   <span>Label for the Button</span>
 </iron-label>
```


1. Set the `for` attribute on the `iron-label` element with the id of the target
element in the same document or ShadowRoot:

```html
 <iron-label for="foo">
   Context for the button with the "foo" class"
 </iron-label>
 <paper-button id="foo">Far away button</paper-button>
```



All taps on the `iron-label` will be forwarded to the "target" element.


