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
goog.require('axs.constants');

(function() {
    'use strict';
    // Over many iterations significant performance gain not re-instantiating regex
    var ARIA_ATTR_RE = /^aria\-/;

    /**
     * This test basically looks for unknown attributes that start with 'aria-'.
     *
     * It is a warning because it is probably not "illegal" to use an expando that starts
     *    with 'aria-', just a generally bad idea. Right?
     *
     * It will catch common typos like "aria-labeledby" and uncommon ones, like "aria-helicopter" :)
     *
     * @type {axs.AuditRule.Spec}
     */
    var badAriaAttribute = {
        name: 'badAriaAttribute',
        heading: 'This element has an invalid ARIA attribute',
        url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_11',
        severity: axs.constants.Severity.WARNING,
        relevantElementMatcher: function(element) {
            var attributes = element.attributes;
            for (var i = 0, len = attributes.length; i < len; i++) {
                if (ARIA_ATTR_RE.test(attributes[i].name)) {
                    return true;
                }
            }
            return false;
        },
        test: function(element) {
            var attributes = element.attributes;
            for (var i = 0, len = attributes.length; i < len; i++) {
                var attributeName = attributes[i].name;
                if (ARIA_ATTR_RE.test(attributeName)) {
                    var lookupName = attributeName.replace(ARIA_ATTR_RE, '');
                    if (!axs.constants.ARIA_PROPERTIES.hasOwnProperty(lookupName)) {
                        return true;
                    }
                }
            }
            return false;
        },
        code: 'AX_ARIA_11'
    };
    axs.AuditRules.addRule(badAriaAttribute);
})();
