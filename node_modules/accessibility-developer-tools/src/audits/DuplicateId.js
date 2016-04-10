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
 * This audit checks for duplicate IDs in the DOM.
 */
axs.AuditRules.addRule({
    name: 'duplicateId',
    heading: 'Any ID referred to via an IDREF must be unique in the DOM',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_html_02',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        if (element.hasAttribute('id')) {
            var referrers = axs.utils.getIdReferrers(element);
            return referrers.some(function(referrer) {
                return !axs.utils.isElementOrAncestorHidden(referrer);
            });
        }
        return false;
    },
    test: function(element) {
        /*
         * Checks for duplicate IDs within the context of this element.
         * This is not a pure a11y check however IDREF attributes in ARIA and HTML (label 'for', td 'headers)
         *    depend on IDs being correctly implemented.
         * Because this audit is noisy (in practice duplicate IDs are not unusual and often harmless)
         *    we limit this audit to IDs which are actually referred to via any IDREF attribute.
         */
        var id = element.id;
        var selector = '[id=\'' + id.replace(/'/g, '\\\'') + '\']';
        var elementsWithId = element.ownerDocument.querySelectorAll(selector);
        return (elementsWithId.length > 1);
    },
    code: 'AX_HTML_02'
});
