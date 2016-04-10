// Copyright 2014 Google Inc.
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

(function() {
    'use strict';
    // Over many iterations it makes a significant performance difference not to re-instantiate regex
    var ARIA_ATTR_RE = /^aria\-/;
    // No need to compute the selector for every element in the DOM.
    var selector = axs.utils.getSelectorForAriaProperties(axs.constants.ARIA_PROPERTIES);

    /**
     * This test looks for known ARIA states and properties that have been used with a role that does
     *    not support it.
     *
     * Severe because people think they are converying information they are not. Right?
     *
     * @type {axs.AuditRule.Spec}
     */
    var unsupportedAriaAttribute = {
        name: 'unsupportedAriaAttribute',
        heading: 'This element has an unsupported ARIA attribute',
        url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_10',
        severity: axs.constants.Severity.SEVERE,
        relevantElementMatcher: function(element) {
            return axs.browserUtils.matchSelector(element, selector);
        },
        test: function(element) {
            // Even though we may not need to look up role, supported etc it's better performance to do it here than in loop
            var role = axs.utils.getRoles(element, true);
            var supported;
            if (role && role.applied) {
                supported = /** @type {Object<string, boolean>} */ (role.applied.details.propertiesSet);
            } else {
                // This test ignores the fact that some HTML elements should not take even global attributes.
                supported = axs.constants.GLOBAL_PROPERTIES;
            }
            var attributes = element.attributes;
            for (var i = 0, len = attributes.length; i < len; i++) {
                var attributeName = attributes[i].name;
                if (ARIA_ATTR_RE.test(attributeName)) {
                    var lookupName = attributeName.replace(ARIA_ATTR_RE, '');
                    // we're only interested in known aria properties
                    if (axs.constants.ARIA_PROPERTIES.hasOwnProperty(lookupName) && !(attributeName in supported)) {
                        return true;
                    }
                }
            }
            return false;
        },
        code: 'AX_ARIA_10'
    };
    axs.AuditRules.addRule(unsupportedAriaAttribute);
})();
