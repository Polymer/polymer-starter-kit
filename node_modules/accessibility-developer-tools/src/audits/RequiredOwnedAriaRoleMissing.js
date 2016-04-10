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
    /**
     * @type {axs.AuditRule.Spec}
     */
    var spec = {
        name: 'requiredOwnedAriaRoleMissing',
        heading: 'Elements with ARIA roles must ensure required owned elements are present',
        url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_08',
        severity: axs.constants.Severity.SEVERE,
        relevantElementMatcher: function(element) {
            if (!axs.browserUtils.matchSelector(element, '[role]'))
                return false;
            var required = getRequired(element);
            return required.length > 0;

        },
        test: function(element) {
            /*
             * Checks that this element contains everything it "must contain".
             */
            var busy = element.getAttribute('aria-busy');
            if (busy === 'true')  // In future this will lower the severity of the warning instead
                return false;  // https://github.com/GoogleChrome/accessibility-developer-tools/issues/101

            var required = getRequired(element);
            for (var i = required.length - 1; i >= 0; i--) {
                var descendants = axs.utils.findDescendantsWithRole(element, required[i]);
                if (descendants && descendants.length) {  // if we found at least one descendant with a required role
                    return false;
                }
            }
            // if we get to this point our element has 'required owned elements' but it does not own them implicitly in the DOM
            var ownedElements = axs.utils.getIdReferents('aria-owns', element);
            for (var i = ownedElements.length - 1; i >= 0; i--) {
                var ownedElement = ownedElements[i];
                var ownedElementRole = axs.utils.getRoles(ownedElement, true);
                if (ownedElementRole && ownedElementRole.applied) {
                    var appliedRole = ownedElementRole.applied;
                    for (var j = required.length - 1; j >= 0; j--) {
                        if (appliedRole.name === required[j]) {  // if this explicitly owned element has a required role
                            return false;
                        }
                    }
                }
            }
            return true;  // if we made it here then we did not find the required owned elements in the DOM
        },
        code: 'AX_ARIA_08'
    };

    /**
     * Get a list of the roles this element must contain, if any, based on its ARIA role.
     * @param {Element} element A DOM element.
     * @return {Array.<string>} The roles this element must contain.
     */
    function getRequired(element) {
        var elementRole = axs.utils.getRoles(element);
        if (!elementRole || !elementRole.applied)
            return [];
        var appliedRole = elementRole.applied;
        if (!appliedRole.valid)
            return [];
        return appliedRole.details['mustcontain'] || [];
    }
    axs.AuditRules.addRule(spec);
})();
