// Copyright 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.require('axs.browserUtils');
goog.require('axs.color');
goog.require('axs.color.Color');
goog.require('axs.constants');
goog.require('axs.dom');

goog.provide('axs.utils');

/**
 * @const
 * @type {string}
 */
axs.utils.FOCUSABLE_ELEMENTS_SELECTOR =
    'input:not([type=hidden]):not([disabled]),' +
    'select:not([disabled]),' +
    'textarea:not([disabled]),' +
    'button:not([disabled]),' +
    'a[href],' +
    'iframe,' +
    '[tabindex]';

/**
 * Elements that can have labels: https://html.spec.whatwg.org/multipage/forms.html#category-label
 * @const
 * @type {string}
 */
axs.utils.LABELABLE_ELEMENTS_SELECTOR =
    'button,' +
    'input:not([type=hidden]),' +
    'keygen,' +
    'meter,' +
    'output,' +
    'progress,' +
    'select,' +
    'textarea';


/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsTransparent = function(element) {
    return element.style.opacity == '0';
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementHasZeroArea = function(element) {
    var rect = element.getBoundingClientRect();
    var width = rect.right - rect.left;
    var height = rect.top - rect.bottom;
    if (!width || !height)
        return true;
    return false;
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsOutsideScrollArea = function(element) {
    var parent = axs.dom.parentElement(element);

    var defaultView = element.ownerDocument.defaultView;
    while (parent != defaultView.document.body) {
        if (axs.utils.isClippedBy(element, parent))
            return true;

        if (axs.utils.canScrollTo(element, parent) && !axs.utils.elementIsOutsideScrollArea(parent))
            return false;

        parent = axs.dom.parentElement(parent);
    }

    return !axs.utils.canScrollTo(element, defaultView.document.body);
};

/**
 * Checks whether it's possible to scroll to the given element within the given container.
 * Assumes that |container| is an ancestor of |element|.
 * If |container| cannot be scrolled, returns True if the element is within its bounding client
 * rect.
 * @param {Element} element
 * @param {Element} container
 * @return {boolean} True iff it's possible to scroll to |element| within |container|.
 */
axs.utils.canScrollTo = function(element, container) {
    var rect = element.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();
    if (container == container.ownerDocument.body) {
        var absoluteTop = containerRect.top;
        var absoluteLeft = containerRect.left;
    } else {
        var absoluteTop = containerRect.top - container.scrollTop;
        var absoluteLeft = containerRect.left - container.scrollLeft;
    }
    var containerScrollArea =
        { top: absoluteTop,
          bottom: absoluteTop + container.scrollHeight,
          left: absoluteLeft,
          right: absoluteLeft + container.scrollWidth };

    if (rect.right < containerScrollArea.left || rect.bottom < containerScrollArea.top ||
        rect.left > containerScrollArea.right || rect.top > containerScrollArea.bottom) {
        return false;
    }

    var defaultView = element.ownerDocument.defaultView;
    var style = defaultView.getComputedStyle(container);

    if (rect.left > containerRect.right || rect.top > containerRect.bottom) {
        return (style.overflow == 'scroll' || style.overflow == 'auto' ||
                container instanceof defaultView.HTMLBodyElement);
    }

    return true;
};

/**
 * Checks whether the given element is clipped by the given container.
 * Assumes that |container| is an ancestor of |element|.
 * @param {Element} element
 * @param {Element} container
 * @return {boolean} True iff |element| is clipped by |container|.
 */
axs.utils.isClippedBy = function(element, container) {
    var rect = element.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();
    var containerTop = containerRect.top;
    var containerLeft = containerRect.left;
    var containerScrollArea =
        { top: containerTop - container.scrollTop,
          bottom: containerTop - container.scrollTop + container.scrollHeight,
          left: containerLeft - container.scrollLeft,
          right: containerLeft - container.scrollLeft + container.scrollWidth };

    var defaultView = element.ownerDocument.defaultView;
    var style = defaultView.getComputedStyle(container);

    if ((rect.right < containerRect.left || rect.bottom < containerRect.top ||
             rect.left > containerRect.right || rect.top > containerRect.bottom) &&
             style.overflow == 'hidden') {
        return true;
    }

    if (rect.right < containerScrollArea.left || rect.bottom < containerScrollArea.top)
        return (style.overflow != 'visible');

    return false;
};

/**
 * @param {Node} ancestor A potential ancestor of |node|.
 * @param {Node} node
 * @return {boolean} true if |ancestor| is an ancestor of |node| (including
 *     |ancestor| === |node|).
 */
axs.utils.isAncestor = function(ancestor, node) {
    if (node == null)
        return false;
    if (node === ancestor)
        return true;

    var parentNode = axs.dom.composedParentNode(node);
    return axs.utils.isAncestor(ancestor, parentNode);
};

/**
 * @param {Element} element
 * @return {Array.<Element>} An array of any non-transparent elements which
 *     overlap the given element.
 */
axs.utils.overlappingElements = function(element) {
    if (axs.utils.elementHasZeroArea(element))
        return null;

    var overlappingElements = [];
    var clientRects = element.getClientRects();
    for (var i = 0; i < clientRects.length; i++) {
        var rect = clientRects[i];
        var center_x = (rect.left + rect.right) / 2;
        var center_y = (rect.top + rect.bottom) / 2;
        var elementAtPoint = document.elementFromPoint(center_x, center_y);

        if (elementAtPoint == null || elementAtPoint == element ||
            axs.utils.isAncestor(elementAtPoint, element) ||
            axs.utils.isAncestor(element, elementAtPoint)) {
            continue;
        }

        var overlappingElementStyle = window.getComputedStyle(elementAtPoint, null);
        if (!overlappingElementStyle)
            continue;

        var overlappingElementBg = axs.utils.getBgColor(overlappingElementStyle,
                                                        elementAtPoint);
        if (overlappingElementBg && overlappingElementBg.alpha > 0 &&
            overlappingElements.indexOf(elementAtPoint) < 0) {
            overlappingElements.push(elementAtPoint);
        }
    }

    return overlappingElements;
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsHtmlControl = function(element) {
    var defaultView = element.ownerDocument.defaultView;

    // HTML control
    if (element instanceof defaultView.HTMLButtonElement)
        return true;
    if (element instanceof defaultView.HTMLInputElement)
        return true;
    if (element instanceof defaultView.HTMLSelectElement)
        return true;
    if (element instanceof defaultView.HTMLTextAreaElement)
        return true;

    return false;
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsAriaWidget = function(element) {
    if (element.hasAttribute('role')) {
        var roleValue = element.getAttribute('role');
        // TODO is this correct?
        if (roleValue) {
            var role = axs.constants.ARIA_ROLES[roleValue];
            if (role && 'widget' in role['allParentRolesSet'])
                return true;
        }
    }
    return false;
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsVisible = function(element) {
    if (axs.utils.elementIsTransparent(element))
        return false;
    if (axs.utils.elementHasZeroArea(element))
        return false;
    if (axs.utils.elementIsOutsideScrollArea(element))
        return false;

    var overlappingElements = axs.utils.overlappingElements(element);
    if (overlappingElements.length)
        return false;

    return true;
};

/**
 * @param {CSSStyleDeclaration} style
 * @return {boolean}
 */
axs.utils.isLargeFont = function(style) {
    var fontSize = style.fontSize;
    var bold = style.fontWeight == 'bold';
    var matches = fontSize.match(/(\d+)px/);
    if (matches) {
        var fontSizePx = parseInt(matches[1], 10);
        var bodyStyle = window.getComputedStyle(document.body, null);
        var bodyFontSize = bodyStyle.fontSize;
        matches = bodyFontSize.match(/(\d+)px/);
        if (matches) {
            var bodyFontSizePx = parseInt(matches[1], 10);
            var boldLarge = bodyFontSizePx * 1.2;
            var large = bodyFontSizePx * 1.5;
        } else {
            var boldLarge = 19.2;
            var large = 24;
        }
        return (bold && fontSizePx >= boldLarge || fontSizePx >= large);
    }
    matches = fontSize.match(/(\d+)em/);
    if (matches) {
        var fontSizeEm = parseInt(matches[1], 10);
        if (bold && fontSizeEm >= 1.2 || fontSizeEm >= 1.5)
            return true;
        return false;
    }
    matches = fontSize.match(/(\d+)%/);
    if (matches) {
        var fontSizePercent = parseInt(matches[1], 10);
        if (bold && fontSizePercent >= 120 || fontSizePercent >= 150)
            return true;
        return false;
    }
    matches = fontSize.match(/(\d+)pt/);
    if (matches) {
        var fontSizePt = parseInt(matches[1], 10);
        if (bold && fontSizePt >= 14 || fontSizePt >= 18)
            return true;
        return false;
    }
    return false;
};

/**
 * @param {CSSStyleDeclaration} style
 * @param {Element} element
 * @return {?axs.color.Color}
 */
axs.utils.getBgColor = function(style, element) {
    var bgColorString = style.backgroundColor;
    var bgColor = axs.color.parseColor(bgColorString);
    if (!bgColor)
        return null;

    if (style.opacity < 1)
        bgColor.alpha = bgColor.alpha * style.opacity;

    if (bgColor.alpha < 1) {
        var parentBg = axs.utils.getParentBgColor(element);
        if (parentBg == null)
            return null;

        bgColor = axs.color.flattenColors(bgColor, parentBg);
    }
    return bgColor;
};

/**
 * Gets the effective background color of the parent of |element|.
 * @param {Element} element
 * @return {?axs.color.Color}
 */
axs.utils.getParentBgColor = function(element) {
    /** @type {Element} */ var parent = element;
    var bgStack = [];
    var foundSolidColor = null;
    while ((parent = axs.dom.parentElement(parent))) {
        var computedStyle = window.getComputedStyle(parent, null);
        if (!computedStyle)
            continue;

        var parentBg = axs.color.parseColor(computedStyle.backgroundColor);
        if (!parentBg)
            continue;

        if (computedStyle.opacity < 1)
            parentBg.alpha = parentBg.alpha * computedStyle.opacity;

        if (parentBg.alpha == 0)
            continue;

        bgStack.push(parentBg);

        if (parentBg.alpha == 1) {
            foundSolidColor = true;
            break;
        }
    }

    if (!foundSolidColor)
        bgStack.push(new axs.color.Color(255, 255, 255, 1));

    var bg = bgStack.pop();
    while (bgStack.length) {
        var fg = bgStack.pop();
        bg = axs.color.flattenColors(fg, bg);
    }
    return bg;
};

/**
 * @param {CSSStyleDeclaration} style
 * @param {Element} element
 * @param {axs.color.Color} bgColor The background color, which may come from
 *    another element (such as a parent element), for flattening into the
 *    foreground color.
 * @return {?axs.color.Color}
 */
axs.utils.getFgColor = function(style, element, bgColor) {
    var fgColorString = style.color;
    var fgColor = axs.color.parseColor(fgColorString);
    if (!fgColor)
        return null;

    if (fgColor.alpha < 1)
        fgColor = axs.color.flattenColors(fgColor, bgColor);

    if (style.opacity < 1) {
        var parentBg = axs.utils.getParentBgColor(element);
        fgColor.alpha = fgColor.alpha * style.opacity;
        fgColor = axs.color.flattenColors(fgColor, parentBg);
    }

    return fgColor;
};

/**
 * @param {Element} element
 * @return {?number}
 */
axs.utils.getContrastRatioForElement = function(element) {
    var style = window.getComputedStyle(element, null);
    return axs.utils.getContrastRatioForElementWithComputedStyle(style, element);
};

/**
 * @param {CSSStyleDeclaration} style
 * @param {Element} element
 * @return {?number}
 */
axs.utils.getContrastRatioForElementWithComputedStyle = function(style, element) {
    if (axs.utils.isElementHidden(element))
        return null;

    var bgColor = axs.utils.getBgColor(style, element);
    if (!bgColor)
        return null;

    var fgColor = axs.utils.getFgColor(style, element, bgColor);
    if (!fgColor)
        return null;

    return axs.color.calculateContrastRatio(fgColor, bgColor);
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.isNativeTextElement = function(element) {
    var tagName = element.tagName.toLowerCase();
    var type = element.type ? element.type.toLowerCase() : '';
    if (tagName == 'textarea')
        return true;
    if (tagName != 'input')
        return false;

    switch (type) {
    case 'email':
    case 'number':
    case 'password':
    case 'search':
    case 'text':
    case 'tel':
    case 'url':
    case '':
        return true;
    default:
        return false;
    }
};

/**
 * @param {number} contrastRatio
 * @param {CSSStyleDeclaration} style
 * @param {boolean=} opt_strict Whether to use AA (false) or AAA (true) level
 * @return {boolean}
 */
axs.utils.isLowContrast = function(contrastRatio, style, opt_strict) {
    // Round to nearest 0.1
    var roundedContrastRatio = (Math.round(contrastRatio * 10) / 10);
    if (!opt_strict) {
        return roundedContrastRatio < 3.0 ||
            (!axs.utils.isLargeFont(style) && roundedContrastRatio < 4.5);
    } else {
        return roundedContrastRatio < 4.5 ||
            (!axs.utils.isLargeFont(style) && roundedContrastRatio < 7.0);
    }
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.hasLabel = function(element) {
    var tagName = element.tagName.toLowerCase();
    var type = element.type ? element.type.toLowerCase() : '';

    if (element.hasAttribute('aria-label'))
        return true;
    if (element.hasAttribute('title'))
        return true;
    if (tagName == 'img' && element.hasAttribute('alt'))
        return true;
    if (tagName == 'input' && type == 'image' && element.hasAttribute('alt'))
        return true;
    if (tagName == 'input' && (type == 'submit' || type == 'reset'))
        return true;

    // There's a separate audit that makes sure this points to an actual element or elements.
    if (element.hasAttribute('aria-labelledby'))
        return true;

    if (element.hasAttribute('id')) {
        var labelsFor = document.querySelectorAll('label[for="' + element.id + '"]');
        if (labelsFor.length > 0)
            return true;
    }

    var parent = axs.dom.parentElement(element);
    while (parent) {
        if (parent.tagName.toLowerCase() == 'label') {
            var parentLabel = /** HTMLLabelElement */ parent;
            if (parentLabel.control == element)
                return true;
        }
        parent = axs.dom.parentElement(parent);
    }
    return false;
};

/**
 * Determine if this element natively supports being disabled (i.e. via the `disabled` attribute.
 * Disabled here means that the element should be considered disabled according to specification.
 * This element may or may not be effectively disabled in practice as this is dependent on implementation.
 *
 * @param {Element} element An element to check.
 * @return {boolean} true If the element supports being natively disabled.
 */
axs.utils.isNativelyDisableable = function(element) {
    var tagName = element.tagName.toUpperCase();
    return (tagName in axs.constants.NATIVELY_DISABLEABLE);
};

/**
 * Determine if this element is disabled directly or indirectly by a disabled ancestor.
 * Disabled here means that the element should be considered disabled according to specification.
 * This element may or may not be effectively disabled in practice as this is dependent on implementation.
 *
 * @param {Element} element An element to check.
 * @return {boolean} true if the element or one of its ancestors is disabled.
 */
axs.utils.isElementDisabled = function(element) {
    if (axs.browserUtils.matchSelector(element, '[aria-disabled=true], [aria-disabled=true] *')) {
        return true;
    }
    if (!axs.utils.isNativelyDisableable(element) ||
            axs.browserUtils.matchSelector(element, 'fieldset>legend:first-of-type *')) {
        return false;
    }
    for (var next = element; next !== null; next = axs.dom.parentElement(next)) {
        if (axs.utils.isNativelyDisableable(next) && next.hasAttribute('disabled')) {
            return true;
        }
    }
    return false;
};

/**
 * @param {Element} element An element to check.
 * @return {boolean} True if the element is hidden from accessibility.
 */
axs.utils.isElementHidden = function(element) {
    if (!(element instanceof element.ownerDocument.defaultView.HTMLElement))
      return false;

    if (element.hasAttribute('chromevoxignoreariahidden'))
        var chromevoxignoreariahidden = true;

    var style = window.getComputedStyle(element, null);
    if (style.display == 'none' || style.visibility == 'hidden')
        return true;

    if (element.hasAttribute('aria-hidden') &&
        element.getAttribute('aria-hidden').toLowerCase() == 'true') {
        return !chromevoxignoreariahidden;
    }

    return false;
};

/**
 * @param {Element} element An element to check.
 * @return {boolean} True if the element or one of its ancestors is
 *     hidden from accessibility.
 */
axs.utils.isElementOrAncestorHidden = function(element) {
    if (axs.utils.isElementHidden(element))
        return true;

    if (axs.dom.parentElement(element))
        return axs.utils.isElementOrAncestorHidden(axs.dom.parentElement(element));
    else
        return false;
};

/**
 * @param {Element} element An element to check
 * @return {boolean} True if the given element is an inline element, false
 *     otherwise.
 */
axs.utils.isInlineElement = function(element) {
    var tagName = element.tagName.toUpperCase();
    return axs.constants.InlineElements[tagName];
};

/**
 *
 * Gets role details from an element.
 * @param {Element} element The DOM element whose role we want.
 * @param {boolean=} implicit if true then implicit semantics will be considered if there is no role attribute.
 *
 * @return {Object}
 */
axs.utils.getRoles = function(element, implicit) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE || (!element.hasAttribute('role') && !implicit))
        return null;
    var roleValue = element.getAttribute('role');
    if (!roleValue && implicit)
        roleValue = axs.properties.getImplicitRole(element);
    if (!roleValue)  // role='' or implicit role came up empty
        return null;
    var roleNames = roleValue.split(' ');
    var result = { roles: [], valid: false };
    for (var i = 0; i < roleNames.length; i++) {
        var role = roleNames[i];
        var ariaRole = axs.constants.ARIA_ROLES[role];
        var roleObject = { 'name': role };
        if (ariaRole && !ariaRole.abstract) {
            roleObject.details = ariaRole;
            if (!result.applied) {
                result.applied = roleObject;
            }
            roleObject.valid = result.valid = true;
        } else {
            roleObject.valid = false;
        }
        result.roles.push(roleObject);
    }

    return result;
};

/**
 * @param {!string} propertyName
 * @param {!string} value
 * @param {!Element} element
 * @return {!Object}
 */
axs.utils.getAriaPropertyValue = function(propertyName, value, element) {
    var propertyKey = propertyName.replace(/^aria-/, '');
    var property = axs.constants.ARIA_PROPERTIES[propertyKey];
    var result = { 'name': propertyName, 'rawValue': value };
    if (!property) {
        result.valid = false;
        result.reason = '"' + propertyName + '" is not a valid ARIA property';
        return result;
    }

    var propertyType = property.valueType;
    if (!propertyType) {
        result.valid = false;
        result.reason = '"' + propertyName + '" is not a valid ARIA property';
        return result;
    }

    switch (propertyType) {
    case "idref":
        var isValid = axs.utils.isValidIDRefValue(value, element);
        result.valid = isValid.valid;
        result.reason = isValid.reason;
        result.idref = isValid.idref;
        // falls through
    case "idref_list":
        var idrefValues = value.split(/\s+/);
        result.valid = true;
        for (var i = 0; i < idrefValues.length; i++) {
            var refIsValid = axs.utils.isValidIDRefValue(idrefValues[i],  element);
            if (!refIsValid.valid)
                result.valid = false;
            if (result.values)
                result.values.push(refIsValid);
            else
                result.values = [refIsValid];
        }
        return result;
    case "integer":
        var validNumber = axs.utils.isValidNumber(value);
        if (!validNumber.valid) {
            result.valid = false;
            result.reason = validNumber.reason;
            return result;
        }
        if (Math.floor(validNumber.value) !== validNumber.value) {
            result.valid = false;
            result.reason = '' + value + ' is not a whole integer';
        } else {
            result.valid = true;
            result.value = validNumber.value;
        }
        return result;
    case "decimal":
    case "number":
        var validNumber = axs.utils.isValidNumber(value);
        result.valid = validNumber.valid;
        if (!validNumber.valid) {
            result.reason = validNumber.reason;
            return result;
        }
        result.value = validNumber.value;
        return result;
    case "string":
        result.valid = true;
        result.value = value;
        return result;
    case "token":
        var validTokenValue = axs.utils.isValidTokenValue(propertyName, value.toLowerCase());
        if (validTokenValue.valid) {
            result.valid = true;
            result.value = validTokenValue.value;
            return result;
        } else {
            result.valid = false;
            result.value = value;
            result.reason = validTokenValue.reason;
            return result;
        }
        // falls through
    case "token_list":
        var tokenValues = value.split(/\s+/);
        result.valid = true;
        for (var i = 0; i < tokenValues.length; i++) {
            var validTokenValue = axs.utils.isValidTokenValue(propertyName, tokenValues[i].toLowerCase());
            if (!validTokenValue.valid) {
                result.valid = false;
                if (result.reason) {
                    result.reason = [ result.reason ];
                    result.reason.push(validTokenValue.reason);
                } else {
                    result.reason = validTokenValue.reason;
                    result.possibleValues = validTokenValue.possibleValues;
                }
            }
            // TODO (more structured result)
            if (result.values)
                result.values.push(validTokenValue.value);
            else
                result.values = [validTokenValue.value];
        }
        return result;
    case "tristate":
        var validTristate = axs.utils.isPossibleValue(value.toLowerCase(), axs.constants.MIXED_VALUES, propertyName);
        if (validTristate.valid) {
            result.valid = true;
            result.value = validTristate.value;
        } else {
            result.valid = false;
            result.value = value;
            result.reason = validTristate.reason;
        }
        return result;
    case "boolean":
        var validBoolean = axs.utils.isValidBoolean(value);
        if (validBoolean.valid) {
            result.valid = true;
            result.value = validBoolean.value;
        } else {
            result.valid = false;
            result.value = value;
            result.reason = validBoolean.reason;
        }
        return result;
    }
    result.valid = false;
    result.reason = 'Not a valid ARIA property';
    return result;
};

/**
 * @param {string} propertyName The name of the property.
 * @param {string} value The value to check.
 * @return {!Object}
 */
axs.utils.isValidTokenValue = function(propertyName, value) {
    var propertyKey = propertyName.replace(/^aria-/, '');
    var propertyDetails = axs.constants.ARIA_PROPERTIES[propertyKey];
    var possibleValues = propertyDetails.valuesSet;
    return axs.utils.isPossibleValue(value, possibleValues, propertyName);
};

/**
 * @param {string} value
 * @param {Object.<string, boolean>} possibleValues
 * @param {string} propertyName The name of the property.
 * @return {!Object}
 */
axs.utils.isPossibleValue = function(value, possibleValues, propertyName) {
    if (!possibleValues[value])
        return { 'valid': false,
                 'value': value,
                 'reason': '"' + value + '" is not a valid value for ' + propertyName,
                 'possibleValues': Object.keys(possibleValues) };
    return { 'valid': true, 'value': value };
};

/**
 * @param {string} value
 * @return {!Object}
 */
axs.utils.isValidBoolean = function(value) {
    try {
        var parsedValue = JSON.parse(value);
    } catch (e) {
        parsedValue = '';
    }
    if (typeof(parsedValue) != 'boolean')
        return { 'valid': false,
                 'value': value,
                 'reason': '"' + value + '" is not a true/false value' };
    return { 'valid': true, 'value': parsedValue };
};

/**
 * @param {string} value
 * @param {!Element} element
 * @return {!Object}
 */
axs.utils.isValidIDRefValue = function(value, element) {
    if (value.length == 0)
        return { 'valid': true, 'idref': value };
    if (!element.ownerDocument.getElementById(value))
        return { 'valid': false,
                 'idref': value,
                 'reason': 'No element with ID "' + value + '"' };
    return { 'valid': true, 'idref': value };
};

/**
 * Tests if a number is real number for a11y purposes.
 * Must be a real, numerical, decimal value; heavily inspired by
 *    http://www.w3.org/TR/wai-aria/states_and_properties#valuetype_number
 * @param {string} value
 * @return {!Object}
 */
axs.utils.isValidNumber = function(value) {
    var failResult = {
        'valid': false,
        'value': value,
        'reason': '"' + value + '" is not a number'
    };
    if (!value) {
        return failResult;
    }
    if (/^0x/i.test(value)) {
        failResult.reason = '"' + value + '" is not a decimal number';  // hex is not accepted
        return failResult;
    }
    var parsedValue = value * 1;
    if (!isFinite(parsedValue)) {
        return failResult;
    }
    return { 'valid': true, 'value': parsedValue };
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.isElementImplicitlyFocusable = function(element) {
    var defaultView = element.ownerDocument.defaultView;

    if (element instanceof defaultView.HTMLAnchorElement ||
        element instanceof defaultView.HTMLAreaElement)
        return element.hasAttribute('href');
    if (element instanceof defaultView.HTMLInputElement ||
        element instanceof defaultView.HTMLSelectElement ||
        element instanceof defaultView.HTMLTextAreaElement ||
        element instanceof defaultView.HTMLButtonElement ||
        element instanceof defaultView.HTMLIFrameElement)
        return !element.disabled;
    return false;
};

/**
 * Returns an array containing the values of the given JSON-compatible object.
 * (Simply ignores any function values.)
 * @param {Object} obj
 * @return {Array}
 */
axs.utils.values = function(obj) {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] != 'function')
            values.push(obj[key]);
    }
    return values;
};

/**
 * Returns an object containing the same keys and values as the given
 * JSON-compatible object. (Simply ignores any function values.)
 * @param {Object} obj
 * @return {Object}
 */
axs.utils.namedValues = function(obj) {
    var values = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] != 'function')
            values[key] = obj[key];
    }
    return values;
};

/** Gets a CSS selector text for a DOM object.
 * @param {Node} obj The DOM object.
 * @return {string} CSS selector text for the DOM object.
 */
axs.utils.getQuerySelectorText = function(obj) {
  if (obj == null || obj.tagName == 'HTML') {
    return 'html';
  } else if (obj.tagName == 'BODY') {
    return 'body';
  }

  if (obj.hasAttribute) {
    if (obj.id) {
      return '#' + obj.id;
    }

    if (obj.className) {
      var selector = '';
      for (var i = 0; i < obj.classList.length; i++)
        selector += '.' + obj.classList[i];

      var total = 0;
      if (obj.parentNode) {
        for (i = 0; i < obj.parentNode.children.length; i++) {
          var similar = obj.parentNode.children[i];
          if (axs.browserUtils.matchSelector(similar, selector))
            total++;
          if (similar === obj)
            break;
        }
      } else {
        total = 1;
      }

      if (total == 1) {
        return axs.utils.getQuerySelectorText(obj.parentNode) +
               ' > ' + selector;
      }
    }

    if (obj.parentNode) {
      var similarTags = obj.parentNode.children;
      var total = 1;
      var i = 0;
      while (similarTags[i] !== obj) {
        if (similarTags[i].tagName == obj.tagName) {
          total++;
        }
        i++;
      }

      var next = '';
      if (obj.parentNode.tagName != 'BODY') {
        next = axs.utils.getQuerySelectorText(obj.parentNode) +
               ' > ';
      }

      if (total == 1) {
        return next +
               obj.tagName;
      } else {
        return next +
               obj.tagName +
               ':nth-of-type(' + total + ')';
      }
    }

  } else if (obj.selectorText) {
    return obj.selectorText;
  }

  return '';
};

/**
 * Gets elements that refer to this element in an ARIA attribute that takes an ID reference list or
 * single ID reference.
 * @param {Element} element a potential referent.
 * @param {string=} opt_attributeName Name of an ARIA attribute to limit the results to, e.g. 'aria-owns'.
 * @return {NodeList} The elements that refer to this element.
 */
axs.utils.getAriaIdReferrers = function(element, opt_attributeName) {
    var propertyToSelector = function(propertyKey) {
        var propertyDetails = axs.constants.ARIA_PROPERTIES[propertyKey];
        if (propertyDetails) {
            if (propertyDetails.valueType === ('idref')) {
                return '[aria-' + propertyKey + '=\'' + id + '\']';
            } else if (propertyDetails.valueType === ('idref_list')) {
                return '[aria-' + propertyKey + '~=\'' + id + '\']';
            }
        }
        return '';
    };
    if (!element)
        return null;
    var id = element.id;
    if (!id)
        return null;
    id = id.replace(/'/g, "\\'");  // make it safe to use in a selector

    if (opt_attributeName) {
        var propertyKey = opt_attributeName.replace(/^aria-/, '');
        var referrerQuery = propertyToSelector(propertyKey);
        if (referrerQuery) {
            return element.ownerDocument.querySelectorAll(referrerQuery);
        }
    } else {
        var selectors = [];
        for (var propertyKey in axs.constants.ARIA_PROPERTIES) {
            var referrerQuery = propertyToSelector(propertyKey);
            if (referrerQuery) {
                selectors.push(referrerQuery);
            }
        }
        return element.ownerDocument.querySelectorAll(selectors.join(','));
    }
    return null;
};

/**
 * Gets elements that refer to this element in an HTML attribute that takes an ID reference list or
 * single ID reference.
 * @param {Element} element a potential referent.
 * @return {NodeList} The elements that refer to this element.
 */
axs.utils.getHtmlIdReferrers = function(element) {
    if (!element)
        return null;
    var id = element.id;
    if (!id)
        return null;
    id = id.replace(/'/g, "\\'");  // make it safe to use in a selector
    var selectorTemplates = [
        '[contextmenu=\'{id}\']',
        '[itemref~=\'{id}\']',
        'button[form=\'{id}\']',
        'button[menu=\'{id}\']',
        'fieldset[form=\'{id}\']',
        'input[form=\'{id}\']',
        'input[list=\'{id}\']',
        'keygen[form=\'{id}\']',
        'label[for=\'{id}\']',
        'label[form=\'{id}\']',
        'menuitem[command=\'{id}\']',
        'object[form=\'{id}\']',
        'output[for~=\'{id}\']',
        'output[form=\'{id}\']',
        'select[form=\'{id}\']',
        'td[headers~=\'{id}\']',
        'textarea[form=\'{id}\']',
        'tr[headers~=\'{id}\']'];
    var selectors = selectorTemplates.map(function(selector) {
        return selector.replace('\{id\}', id);
    });
    return element.ownerDocument.querySelectorAll(selectors.join(','));
};

/**
 * Gets elements that refer to this element in an attribute that takes an ID reference list or
 * single ID reference.
 * @param {Element} element a potential referent.
 * @return {Array<Element>} The elements that refer to this element.
 */
axs.utils.getIdReferrers = function(element) {
    var result = [];
    var referrers = axs.utils.getHtmlIdReferrers(element);
    if (referrers) {
        result = result.concat(Array.prototype.slice.call(referrers));
    }
    referrers = axs.utils.getAriaIdReferrers(element);
    if (referrers) {
        result = result.concat(Array.prototype.slice.call(referrers));
    }
    return result;
};

/**
 * Gets elements which this element refers to in the given attribute.
 * @param {!string} attributeName Name of an ARIA attribute, e.g. 'aria-owns'.
 * @param {Element} element The DOM element which has the ARIA attribute.
 * @return {!Array.<Element>} An array of elements that are referred to by this element.
 * @example
 *    var owner = document.body.appendChild(document.createElement("div"));
 *    var owned = document.body.appendChild(document.createElement("div"));
 *    owner.setAttribute("aria-owns", "kungfu");
 *    owned.setAttribute("id", "kungfu");
 *    console.log(axs.utils.getIdReferents("aria-owns", owner)[0] === owned);  // This will log 'true'
 */
axs.utils.getIdReferents = function(attributeName, element) {
    var result = [];
    var propertyKey = attributeName.replace(/^aria-/, '');
    var property = axs.constants.ARIA_PROPERTIES[propertyKey];
    if (!property || !element.hasAttribute(attributeName))
        return result;
    var propertyType = property.valueType;
    if (propertyType === 'idref_list' || propertyType === 'idref') {
        var ownerDocument = element.ownerDocument;
        var ids = element.getAttribute(attributeName);
        ids = ids.split(/\s+/);
        for (var i = 0, len = ids.length; i < len; i++) {
            var next = ownerDocument.getElementById(ids[i]);
            if (next) {
                result[result.length] = next;
            }
        }
    }
    return result;
};

/**
 * Gets a subset of 'axs.constants.ARIA_PROPERTIES' filtered by 'valueType'.
 * @param {!Array.<string>} valueTypes Types to match, e.g. ['idref_list'].
 * @return {Object.<string, Object>} axs.constants.ARIA_PROPERTIES which match.
 */
axs.utils.getAriaPropertiesByValueType = function(valueTypes) {
    var result = {};
    for (var propertyName in axs.constants.ARIA_PROPERTIES) {
        var property = axs.constants.ARIA_PROPERTIES[propertyName];
        if (property && valueTypes.indexOf(property.valueType) >= 0) {
            result[propertyName] = property;
        }
    }
    return result;
};

/**
 * Builds a selector that matches an element with any of these ARIA properties.
 * @param {Object.<string, Object>} ariaProperties axs.constants.ARIA_PROPERTIES
 * @return {!string} The selector.
 */
axs.utils.getSelectorForAriaProperties = function(ariaProperties) {
    var propertyNames = Object.keys(/** @type {!Object} */(ariaProperties));
    var result = propertyNames.map(function(propertyName) {
        return '[aria-' + propertyName + ']';
    });
    result.sort();  // facilitates reading long selectors and unit testing
    return result.join(',');
};

/**
 * Finds descendants of this element which implement the given ARIA role.
 * Will look for descendants with implicit or explicit role.
 * @param {Element} element an HTML DOM element.
 * @param {string} role The role you seek.
 * @return {!Array.<Element>} An array of matching elements.
 * @example
 *    var container = document.createElement("div");
 *    var button = document.createElement("button");
 *    var span = document.createElement("span");
 *    span.setAttribute("role", "button");
 *    container.appendChild(button);
 *    container.appendChild(span);
 *    var result = axs.utils.findDescendantsWithRole(container, "button");  // result is an array containing both 'button' and 'span'
 */
axs.utils.findDescendantsWithRole = function(element, role) {
    if (!(element && role))
        return [];
    var selector = axs.properties.getSelectorForRole(role);
    if (!selector)
        return [];
    var result = element.querySelectorAll(selector);
    if (result) {  // Convert NodeList to Array; methinks 80/20 that's what callers want.
        result = Array.prototype.map.call(result, function(item) { return item; });
    } else {
        return [];
    }
    return result;
};
