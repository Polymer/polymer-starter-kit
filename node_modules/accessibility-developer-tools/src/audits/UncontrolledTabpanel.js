// Copyright 2015 Google Inc.
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

(function() {
    /**
     * Checks if the tabpanel is labeled by a tab
     *
     * @param {Element} element the tabpanel element
     * @returns {boolean} the tabpanel has an aria-labelledby with the id of a tab
     */
    function labeledByATab(element) {
        if (element.hasAttribute('aria-labelledby')) {
            var labelingElements = document.querySelectorAll('#' + element.getAttribute('aria-labelledby'));
            return labelingElements.length === 1 && labelingElements[0].getAttribute('role') === 'tab';
        }
        return false;
    }

    /**
     * Checks if the tabpanel is controlled by a tab
     * @param {Element} element the tabpanel element
     * @returns {*|boolean}
     */
    function controlledByATab(element) {
        var controlledBy = document.querySelectorAll('[role="tab"][aria-controls="' + element.id + '"]')
        return element.id && (controlledBy.length === 1);
    }

    // This rule addresses the suggested relationship between a tabpanel and a tab here:
    // http://www.w3.org/TR/wai-aria/roles#tabpanel
    axs.AuditRules.addRule({
        name: "uncontrolledTabpanel",
        heading: "A tabpanel should be related to a tab via aria-controls or aria-labelledby",
        url: "https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_13",
        severity: axs.constants.Severity.WARNING,
        relevantElementMatcher: function(element) {
            return axs.browserUtils.matchSelector(element, '[role="tabpanel"]');
        },
        test: function(element) {
            return !(controlledByATab(element) || labeledByATab(element));
        },
        code: 'AX_ARIA_13'
    });
})();
