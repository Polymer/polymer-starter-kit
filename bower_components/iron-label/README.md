# iron-label
A version of the `<label>` element that works with custom elements as well as native elements.

All text in the `iron-label` will be applied to the target element as a screen-reader accessible description.

There are three ways to use `iron-label` to target an element:

1. place an element inside iron-label and some text:

        <iron-label>
          Label for the Button
          <paper-button>button</paper-button>
        </iron-label>

2. place some elements inside iron-label and target one with the `iron-label-target` attribute.
The other elements will provide the label for that element
Note: This is not necessary if the element you want to label is the first
element child of iron-label:

        <iron-label>
          <span>Label for the Button</span>
          <paper-button iron-label-target>button</paper-button>
        </iron-label>

        <iron-label>
          <paper-button>button</paper-button>
          <span>Label for the Button</span>
        </iron-label>

3. Set the `for` attribute on the `iron-label` element with the id of the target
element in the same document or ShadowRoot:

        <iron-label for="foo">
          Context for the button with the "foo" class"
        </iron-label>
        <paper-button id="foo">Far away button</paper-button>

All taps on the `iron-label` will be forwarded to the "target" element.
