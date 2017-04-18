# iron-elements

Basic building blocks for creating an application. Most of the `iron` elements were previously named the `core` elements, when compatible with the "Developer Preview" version of the Polymer library.

## Roadmap

### Elements recently released

* [`iron-page-url`](https://github.com/PolymerElements/iron-page-url) - Handles data binding into and out of the URL. The foundation of routing.
* [`iron-demo-helpers`](https://github.com/PolymerElements/iron-demo-helpers) - Utility classes to make building demo pages easier.
* [`iron-swipeable-container`](https://github.com/PolymerElements/iron-swipeable-container) - A container that allows any of its nested children to be swiped away.
* [`iron-label`](https://github.com/PolymerElements/iron-label) - A version of the `<label>` element that works with custom elements as well as native elements.
* [`iron-list`](https://github.com/PolymerElements/iron-list) - Displays a virtual, 'infinite' scrolling list of items.

### Elements in progress

_No `iron-elements` are currently in progress._

### Elements planned

_No `iron-elements` are currently planned._

### Elements not planned, notably
_Elements we're not planning on building as part of this product line, but that one might be wondering about_

A number of elements existed as `core` elements that are not in this product line:
* `core-action-icons` - This wasn't really an element, and wasn't particularly heavily used.
* `core-animation` - The animation-related elements that were part of core will be created as part of the `neon` product line.
* `core-docs` - Deprecated: use [`iron-doc-viewer`](https://github.com/PolymerElements/iron-doc-viewer).
* `core-drag-drop` - Not currently working on.
* `core-dropdown` and `core-dropdown-menu` - These were confusing UI to have in `core`, so we've moved them to the `paper` element set for now and made them easier to customize. More on the thought process behind this change in the [blog](https://blog.polymer-project.org/announcements/2015/05/14/updated-elements/).
* `core-focusable` - This has been re-implemented using Polymer behaviors - see for example the `paper-radio-button-behavior` in [`paper-behaviors`](https://github.com/PolymerElements/paper-behaviors).
* `core-item` - This had UI opinion, so was re-implemented as [`paper-item`](https://github.com/PolymerElements/paper-item).
* `core-layout` - We're working on more stable, consistent layout elements.
* `core-overlay` - This is re-implemented as a behavior, in [`iron-overlay-behavior`](https://github.com/PolymerElements/iron-overlay-behavior).
* `core-popup-menu` - This element wasn't particularly of unique value, so we're putting it away for now.
* `core-scroll-header-panel` - This had UI opinion, so it's been moved to [`paper-scroll-header-panel`](https://github.com/PolymerElements/paper-scroll-header-panel).
* `core-splitter` - This element was relatively trivial, so we've put it off for now.
* `core-style` - This element is not useful with Polymer's new styling system. Check out the latest docs for more.
* `core-tooltip` - This has become `paper-tooltip`.
* `core-menu` - This had UI opinion, and has become `paper-dropdown-menu`.
