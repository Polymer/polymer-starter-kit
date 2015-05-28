# breakpoint-control
> Allows to attach behavior to user defined media queries.


### Paper Breakpoints

- mobile-small
- mobile-large
- mobile-small-landscape
- mobile-large-landscape 
- tablet-small-landscape
- tablet-large-landscape
- tablet-small
- tablet-large
- leanback
- desktop-x-small-landscape
- desktop-x-small
- desktop-small-landscape
- desktop-small
- desktop-medium-landscape
- desktop-medium
- desktop-large
- desktop-xlarge

### Importing paper breakpoints

```html
  <link rel="import" href="../breakpoint-control/paper-breakpoint-control.html">
```

### Defining your own breakpoints

```html
<breakpoint-control target="html">
  <breakpoint-rule name="im-desktop" platform="desktop"></breakpoint-rule>
</breakpoint-control>
```

The selector specified in the ``target`` attribute of ``<breakpoint-control>`` will have the class ``im-desktop`` when the user is on a desktop. In this case, it would be the ``<html>`` tag.  You could also listen for the event ``breakpointChanged`` in that target.

### Grid [Experimental]

Sometimes it can be useful to have a grid to lay out elements on the screen. In this case, you could import ``breakpoint-control-development.html``
```html
  <link rel="import" href="../breakpoint-control/breakpoint-control-development.html">
```

Now you can add the class ``grid`` to any HTML Element.  You can specify the grid settings by using the custom properties: ``--grid-columns`` and ``--grid-gutter``. For example:

```css
.im-desktop target-element {
    --grid-columns: 12;
    --grid-gutter: 24px;
}
```