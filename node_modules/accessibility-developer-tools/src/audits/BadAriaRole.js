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
 * This audit checks the `role` attribute to ensure it contains a valid, non-abstract ARIA role.
 */
axs.AuditRules.addRule({
    name: 'badAriaRole',
    heading: 'Elements with ARIA roles must use a valid, non-abstract ARIA role',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_01',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, '[role]');
    },
    test: function(element) {
        var roles = axs.utils.getRoles(element);
        return !roles.valid;
    },
    code: 'AX_ARIA_01'
});
