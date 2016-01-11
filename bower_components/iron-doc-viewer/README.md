
<!---

This README is automatically generated from the comments in these files:
iron-doc-property.html  iron-doc-viewer.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

-->

[![Build Status](https://travis-ci.org/PolymerElements/iron-doc-viewer.svg?branch=master)](https://travis-ci.org/PolymerElements/iron-doc-viewer)

_[Demo and API Docs](https://elements.polymer-project.org/elements/iron-doc-viewer)_


##&lt;iron-doc-viewer&gt;


Renders documentation describing an element's API.

`iron-doc-viewer` renders element and behavior descriptions as extracted by
[Hydrolysis](https://github.com/PolymerLabs/hydrolysis). You can provide them
either via binding...

    <iron-doc-viewer descriptor="{{elementDescriptor}}"></iron-doc-viewer>

...or by placing the element descriptor in JSON as the text content of an
`iron-doc-viewer`:

    <iron-doc-viewer>
      {
        "is": "awesome-sauce",
        "properties": [
          {"name": "isAwesome", "type": "boolean", "desc": "Is it awesome?"},
        ]
      }
    </iron-doc-viewer>

However, be aware that due to current limitations in Polymer 0.8, _changes_ to
the text content will not be respected, only the initial value will be loaded.
If you wish to update the documented element, please set it via the `descriptor`
property.



##&lt;iron-doc-property&gt;


Renders documentation describing a specific property of an element.

Give it a hydrolysis `PropertyDescriptor` (via `descriptor`), and watch it go!

