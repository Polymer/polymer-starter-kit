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
goog.require('axs.utils');

axs.AuditRules.addRule({
    name: 'multipleLabelableElementsPerLabel',
    heading: 'A label element may not have labelable descendants other than its labeled control.',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#-ax_text_03--labels-should-only-contain-one-labelable-element',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, 'label');
    },
    test: function(scope) {
        var controls = scope.querySelectorAll(axs.utils.LABELABLE_ELEMENTS_SELECTOR);
        if (controls.length > 1)
            return true;
    },
    code: 'AX_TEXT_03'
});
