# paper-badge

`<paper-badge>` is a circular text badge that is displayed on the top right
corner of an element, representing a status or a notification. It will badge
the anchor element specified in the `for` attribute, or, if that doesn't exist,
centered to the parent node containing it.

Example:

    <div style="display:inline-block">
      <span>Inbox</span>
      <paper-badge label="3"></paper-badge>
    </div>
    <div>
      <paper-button id="btn">Status</paper-button>
      <paper-badge for="btn" label="♥︎"></paper-badge>
    </div>
    
    
### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-badge-background` | The background color of the badge | `--accent-color`
`--paper-badge-opacity` | The opacity of the badge | `1.0`
`--paper-badge-text-color` | The color of the badge text | `white`
`--paper-badge-width` | The width of the badge circle | `22px`
`--paper-badge-height` | The height of the badge circle | `22px`
`--paper-badge-margin-left` | Optional spacing added to the left of the badge. | `0px`
`--paper-badge-margin-bottom` | Optional spacing added to the bottom of the badge. | `0px`
`--paper-badge` | Mixin applied to the badge | `{}`
