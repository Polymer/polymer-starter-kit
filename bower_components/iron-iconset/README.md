iron-iconset
============

The `iron-iconset` element allows users to define their own icon sets.
The `src` property specifies the url of the icon image. Multiple icons may
be included in this image and they may be organized into rows.
The `icons` property is a space separated list of names corresponding to the
icons. The names must be ordered as the icons are ordered in the icon image.
Icons are expected to be square and are the size specified by the `size`
property. The `width` property corresponds to the width of the icon image
and must be specified if icons are arranged into multiple rows in the image.

All `iron-iconset` elements are available for use by other `iron-iconset`
elements via a database keyed by id. Typically, an element author that wants
to support a set of custom icons uses a `iron-iconset` to retrieve
and use another, user-defined iconset.

Example:

```html
<iron-iconset id="my-icons" src="my-icons.png" width="96" size="24"
    icons="location place starta stopb bus car train walk">
</iron-iconset>
```

This will automatically register the icon set "my-icons" to the iconset
database.  To use these icons from within another element, make a
`iron-iconset` element and call the `byId` method to retrieve a
given iconset. To apply a particular icon to an element, use the
`applyIcon` method. For example:

```javascript
iconset.applyIcon(iconNode, 'car');
```

Themed icon sets are also supported. The `iron-iconset` can contain child
`property` elements that specify a theme with an offsetX and offsetY of the
theme within the icon resource. For example.

```html
<iron-iconset id="my-icons" src="my-icons.png" width="96" size="24"
    icons="location place starta stopb bus car train walk">
  <property theme="special" offsetX="256" offsetY="24"></property>
</iron-iconset>
```

Then a themed icon can be applied like this:

```javascript
iconset.applyIcon(iconNode, 'car', 'special');
```
