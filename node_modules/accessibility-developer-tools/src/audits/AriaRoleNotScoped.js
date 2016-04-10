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
goog.require('axs.dom');
goog.require('axs.utils');

/**
 * This test checks ARIA roles which must be owned by another role.
 *    For example a role of `tab` can only exist within a `tablist`.
 *    This ownership can be represented implicitly by DOM hierarchy or explictly through the `aria-owns` attribute.
 */
axs.AuditRules.addRule({
    name: 'ariaRoleNotScoped',
    heading: 'Elements with ARIA roles must be in the correct scope',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_09',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, '[role]');
    },
    test: function(element) {
        /*
         * Checks that this element is in the required scope for its role.
         */
        var elementRole = axs.utils.getRoles(element);
        if (!elementRole || !elementRole.applied)
            return false;
        var appliedRole = elementRole.applied;
        var ariaRole = appliedRole.details;
        var requiredScope = ariaRole['scope'];
        if (!requiredScope || requiredScope.length === 0) {
            return false;
        }
        var parent = element;
        while (parent = axs.dom.parentElement(parent)) {
            var parentRole = axs.utils.getRoles(parent, true);
            if (parentRole && parentRole.applied) {
                var appliedParentRole = parentRole.applied;
                if (requiredScope.indexOf(appliedParentRole.name) >= 0)  // if this ancestor role is one of the required roles
                    return false;
            }
        }
        // If we made it this far then no DOM ancestor has a required scope role.
        // Now we need to check if anything aria-owns this element.
        var owners = axs.utils.getAriaIdReferrers(element, 'aria-owns');  // there can only be ONE explicit owner but that's a different test
        if (owners) {
            for (var i = 0; i < owners.length; i++) {
                var ownerRole = axs.utils.getRoles(owners[i], true);
                if (ownerRole && ownerRole.applied && requiredScope.indexOf(ownerRole.applied.name) >= 0)
                    return false;  // the owner role is one of the required roles
            }
        }
        return true;
    },
    code: 'AX_ARIA_09'
});
