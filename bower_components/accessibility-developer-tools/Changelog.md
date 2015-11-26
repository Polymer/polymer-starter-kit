## 2.10.0 - 2015-11-13

## 2.10.0-rc.1 - 2015-10-19

### Bug fixes:

* `linkWithUnclearPurpose` should only look at links, not `<a>` without `href`. (#245)

## 2.10.0-rc.0 - 2015-10-09

### New rules
* A tabpanel should be related to a tab via aria-controls or aria-labelledby (`src/audits/UncontrolledTabpanel.js`)
* A data table must identify row and column headers (`src/audits/TableHasAppropriateHeaders.js`)
* A tooltip element should have an aria-describedby referring to it (`src/audits/RoleTooltipRequiresDescribedBy.js`).

### Enhancements

* Pull DOM-related functionality out into `DOMUtils.js`

### Bug fixes:

* Fix `findTextAlternatives` not always correctly ignoring hidden elements (#217).
* `findTextAlternatives` now honors `alt` attribute of input type image
* Revert #150 which was causing the extension not to work.
* AX_HTML_02 (duplicate IDs) now only audits elements that are referenced by an IDREF (#141);
* Fix #171 by being smarter about finding the composed parent node.
* Tweak in canScrollTo to handle the (common) case where the container is `document.body` (#243).

## 2.9.0 - 2015-09-04

## 2.9.0-rc.0 - 2015-08-21

### New rules

* A label element may not have labelable descendants other than its labeled control (`src/audits/MultipleLabelableElementsPerLabel.js`)

### Enhancements

* Implement support for specifying audit configuration options through an object when initializing audits (#165).
* Implement support for AMD loaders.

### Bug fixes:

* Fix `badAriaAttributeValue` not correctly handling decimal values (#182).
* Work around null pointer exception caused by closure compiler issue (#183).
* Add a special case to handle color `"transparent"` to fix (#180).
* Fix `matchSelector` not working properly in browser environments without vendor prefixes (#189).
* Fix false positives on elements with no role for Unsupported ARIA Attribute rule (#178 and #199).
* Fix ARIA `tablist` and ARIA `tab` scope (#204)
* Fix link with clear purpose with text alternative (#156);
* Handle edge cases in number parser, e.g. "+1", ".1", "01"
* HTML button containing img with alt attribute now passes controlsWithoutLabel (#202)
* Disabled elements should be ignored by low contrast audit (#205)
* Fix input of type "text" did not find correct implied role (#225)
* Hidden links are no longer relevant for meaningful link text rule.

## 2.8.0 - 2015-07-24

## 2.8.0-rc.0 - 2015-07-10

### Enhancements:
* Pull color code into separate file.
* Improve color suggestion algorithm.
* Descend into iframes when collecting matching elements.

## 2.7.1 - 2015-06-30

## 2.7.1-rc.1 - 2015-06-23

### Bug fixes:

* Check for null `textAlternatives` in `FocusableElementNotVisibleAndNotAriaHidden`'s `relevantElementMatcher` method.

## 2.7.1-rc.0 - 2015-06-15

### Enhancements:
* Rework findTextAlternatives not to return non-exposed text alternatives.
* Add Bower config (#157)

### Bug fixes:
* Check for any text alternatives when assessing unlabeled images (#154).

## 2.7.0 - 2015-05-15

### New rules
* This element does not support ARIA roles, states and properties (`src/audits/AriaOnReservedElement.js`)
* aria-owns should not be used if ownership is implicit in the DOM (`src/audits/AriaOwnsDescendant.js`)
* Elements with ARIA roles must be in the correct scope (`src/audits/AriaRoleNotScoped.js`)
* An element's ID must be unique in the DOM (`src/audits/DuplicateId.js`)
* The web page should have the content's human language indicated in the markup (`src/audits/HumanLangMissing.js`)
* An element's ID must not be present in more that one aria-owns attribute at any time (`src/audits/MultipleAriaOwners.js`)
* ARIA attributes which refer to other elements by ID should refer to elements which exist in the DOM (`src/audits/NonExistentAriaRelatedElement.js` - previously `src/audits/NonExistentAriaLabeledBy.js`)
* Elements with ARIA roles must ensure required owned elements are present (`src/audits/RequiredOwnedAriaRoleMissing.js`)
* Avoid positive integer values for tabIndex (`src/audits/TabIndexGreaterThanZero.js`)
* This element has an unsupported ARIA attribute (`src/audits/UnsupportedAriaAttribute.js`)

### Enhancements:
* Add configurable blacklist phrases and stop words to LinkWithUnclearPurpose (#99)
* Detect and warn if we reuse the same code for more than one rule. (#133)
* Force focus before testing visibility on focusable elements. (#65)
* Use getDistributedNodes to get nodes distributed into shadowRoots (#128)
* Add section to Audit Rules page for HumanLangMissing and link to it from rule (#119)
* Reference "applied role" in axs.utils.getRoles enhancement (#130)
* Add warning that AX_FOCUS_02 is not available from axs.Audit.run() (#85)

### Bug fixes:
* Incorrect use of nth-of-type against className in utils.getQuerySelectorText (#87)
* AX_TEXT_01 Accessibility Audit test should probably ignore role=presentation elements (#97)
* Fix path to audit rules in phantomjs runner (#108)
* Label audit should fail if form fields lack a label, even with placeholder text (#81)
* False positives for controls without labels with role=presentation (#23)
* Fix "valid" flag on return value of axs.utils.getRoles (#131)

Note: this version number is somewhat arbitrary - just bringing it vaguely in line with [the extension](https://github.com/GoogleChrome/accessibility-developer-tools-extension) since that's where the library originated - but will use semver for version bumps going forward from here.

## 0.0.5 - 2014-02-04

### Enhancements:
* overlapping elements detection code made more sophisticated
* axs.properties.getFocusProperties() returns more information about visibility
* new axs.properties.hasDirectTextDescendant() method with more sophisticated detection of text content

### Bug fixes:
* FocusableElementNotVisibleAndNotAriaHidden audit passes on elements which are brought onscreen on focus
* UnfocusableElementsWithOnclick checks for element.disabled
* Fix infinite loop when getting descendant text content of a label containing an input
* Detect elements which are out of scroll area of any parent element, not just the document scroll area
* findTextAlternatives doesn't throw TypeError if used on a HTMLSelectElement

## 0.0.4 - 2013-10-03

### Enhancements:

* axs.AuditRule.run() has a new signature: it now takes an options object. Please see method documentation for details.
* Audit Rule severity can be overridden (per Audit Rule) in AuditConfig.

### Bug fixes:

* axs.utils.isLowContrast() now rounds to the nearest 0.1 before checking (so `#777` is now a passing value)
* MainRoleOnInappropriateElement was always failing due to accessible name calculation taking the main role into account and not descending into content (now just gets descendant content directly)
* UnfocusableElementsWithOnClick had a dangling if-statement causing very noisy false positives
