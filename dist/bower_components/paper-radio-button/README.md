# paper-radio-button

`paper-radio-button` is a button that can be either checked or unchecked.
User can tap the radio button to check it.  But it cannot be unchecked by
tapping once checked.

Use `paper-radio-group` to group a set of radio buttons.  When radio buttons
are inside a radio group, only one radio button in the group can be checked.

Example:

```html
<paper-radio-button></paper-radio-button>
```
Styling a radio button:

```html
<style is="custom-style">
  * {
    /* Unchecked state colors. */
    --paper-radio-button-unchecked-color: #5a5a5a;
    --paper-radio-button-unchecked-ink-color: #5a5a5a;

    /* Checked state colors. */
    --paper-radio-button-checked-color: #009688;
    --paper-radio-button-checked-ink-color: #0f9d58;
  }
</style>
```
