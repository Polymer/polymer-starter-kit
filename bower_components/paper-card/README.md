# paper-card

Material Design: <a href="http://www.google.com/design/spec/components/cards.html">Cards</a>

`paper-card` is a container with a drop shadow.

Example:
```html
<paper-card heading="Card Title">
  <div class="card-content">Some content</div>
  <div class="card-actions">
    <paper-button>Some action</paper-button>
  </div>
</paper-card>
```

### Accessibility
By default, the `aria-label` will be set to the value of the `heading` attribute.

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-card-header-color` | The color of the header text | `#000`
`--paper-card-header` | Mixin applied to the card header section | `{}`
`--paper-card-content` | Mixin applied to the card content section| `{}`
`--paper-card-actions` | Mixin applied to the card action section | `{}`
`--paper-card` | Mixin applied to the card | `{}`
