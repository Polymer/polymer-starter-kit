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

goog.require('axs.AuditRules');
goog.require('axs.browserUtils');
goog.require('axs.constants');
goog.require('axs.utils');

/**
 * This audit checks the values of ARIA states and properties to ensure they are valid.
 */
axs.AuditRules.addRule({
    name: 'badAriaAttributeValue',
    heading: 'ARIA state and property values must be valid',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_04',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        var selector = axs.utils.getSelectorForAriaProperties(axs.constants.ARIA_PROPERTIES);
        return axs.browserUtils.matchSelector(element, selector);
    },
    test: function(element) {
        for (var property in axs.constants.ARIA_PROPERTIES) {
            var ariaProperty = 'aria-' + property;
            if (!element.hasAttribute(ariaProperty))
                continue;
            var propertyValueText = element.getAttribute(ariaProperty);
            var propertyValue = axs.utils.getAriaPropertyValue(ariaProperty, propertyValueText, element);
            if (!propertyValue.valid)
                return true;
        }
        return false;
    },
    code: 'AX_ARIA_04'
});
