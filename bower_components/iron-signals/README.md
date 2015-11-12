iron-signals
============

`iron-signals` provides basic publish-subscribe functionality.

Note: avoid using `iron-signals` whenever you can use
a controller (parent element) to mediate communication
instead.

To send a signal, fire a custom event of type `iron-signal`, with
a detail object containing `name` and `data` fields.

```javascript
this.fire('iron-signal', {name: 'hello', data: null});
```

To receive a signal, listen for `iron-signal-<name>` event on a
`iron-signals` element.

```html
<iron-signals on-iron-signal-hello="helloSignal">
```

You can fire a signal event from anywhere, and all
`iron-signals` elements will receive the event, regardless
of where they are in DOM.
