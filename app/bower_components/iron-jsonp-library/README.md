# iron-jsonp-library

`Polymer.IronJsonpLibraryBehavior` loads a jsonp library.
Multiple components can request same library, only one copy will load.

Some libraries require a specific global function be defined.
If this is the case, specify the `callbackName` property.

You should use an HTML Import to load library dependencies
when possible instead of using this element.
