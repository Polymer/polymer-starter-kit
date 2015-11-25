iron-localstorage
=================

Element access to localStorage.  The "name" property
is the key to the data ("value" property) stored in localStorage.

`iron-localstorage` automatically saves the value to localStorage when
value is changed.  Note that if value is an object auto-save will be
triggered only when value is a different instance.

```html
<iron-localstorage name="my-app-storage" value="{{value}}"></iron-localstorage>
```
