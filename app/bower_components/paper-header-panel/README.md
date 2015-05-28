# paper-header-panel

`paper-header-panel` contains a header section and a content panel section.

__Important:__ The `paper-header-panel` will not display if its parent does not have a height.

Using [layout classes](http://www.polymer-project.org/docs/polymer/layout-attrs.html), you can make
the `paper-header-panel` fill the screen

```html
<body class="fullbleed layout vertical">
  <paper-header-panel class="flex">
    <paper-toolbar>
      <div>Hello World!</div>
    </paper-toolbar>
  </paper-header-panel>
</body>
```

or, if you would prefer to do it in CSS, give `html`, `body`, and `paper-header-panel` a height of
100%:

```css
html, body {
  height: 100%;
  margin: 0;
}

paper-header-panel {
  height: 100%;
}
```

Special support is provided for scrolling modes when one uses a paper-toolbar or equivalent for the
header section.

Example:

```html
<paper-header-panel>
  <paper-toolbar>Header</paper-toolbar>
  <div>Content goes here...</div>
</paper-header-panel>
```

If you want to use other than `paper-toolbar` for the header, add `paper-header` class to that
element.

Example:

```html
<paper-header-panel>
  <div class="paper-header">Header</div>
  <div>Content goes here...</div>
</paper-header-panel>
```

To have the content fit to the main area, use the `fit` class.

```html
<paper-header-panel>
  <div class="paper-header">standard</div>
  <div class="content fit">content fits 100% below the header</div>
</paper-header-panel>
```

Use `mode` to control the header and scrolling behavior.

Styling header panel:

To change the shadow that shows up underneath the header:

```css
paper-header-panel {
  --paper-header-panel-shadow: {
      height: 6px;
      bottom: -6px;
      box-shadow: inset 0px 5px 6px -3px rgba(0, 0, 0, 0.4);
  };
}
```

To change the panel container:

```css
paper-slider {
  --paper-header-panel-standard-container: {
    border: 1px solid gray;
  };
}
```
