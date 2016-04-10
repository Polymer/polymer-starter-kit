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
goog.require('axs.constants.Severity');
goog.require('axs.utils');

/**
 * This test checks that aria-owns does not reference an element that is already owned implicitly.
 */
axs.AuditRules.addRule({
    // TODO(RickSBrown): check for elements that try to 'aria-own' an ancestor;
    // Also: own self does not make sense. Perhaps any IDREF pointing to itself is bad?
    // Perhaps even extend this beyond ARIA (e.g. label for itself). Have to change return code?
    // Also: other "bad hierarchy" tests - e.g. active-descendant owning a non-descendant...
    name: 'ariaOwnsDescendant',
    heading: 'aria-owns should not be used if ownership is implicit in the DOM',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_06',
    severity: axs.constants.Severity.WARNING,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, '[aria-owns]');
    },
    test: function(element) {
        var attr = 'aria-owns';
        var ownedElements = axs.utils.getIdReferents(attr, element);
        return ownedElements.some(function(ownedElement) {
            return (element.compareDocumentPosition(ownedElement) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        });
    },
    code: 'AX_ARIA_06'
});
