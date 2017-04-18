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

(function () {
    /**
     * Checks for a header row in a table.
     *
     * @param {NodeList} rows tr elements
     * @returns {boolean} Table does not have a complete header row
     */
    function tableDoesNotHaveHeaderRow(rows) {
        var headerRow = rows[0];

        var headerCells = headerRow.children;

        for (var i = 0; i < headerCells.length; i++) {
            if (headerCells[i].tagName != 'TH') {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks for a header column in a table.
     *
     * @param {NodeList} rows tr elements
     * @returns {boolean} Table does not have a complete header column
     */
    function tableDoesNotHaveHeaderColumn(rows) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].children[0].tagName != 'TH') {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks whether a table has grid layout with both row and column headers.
     *
     * @param {NodeList} rows tr elements
     * @returns {boolean} Table does not have a complete grid layout
     */
    function tableDoesNotHaveGridLayout(rows) {
        var headerCells = rows[0].children;

        for (var i = 1; i < headerCells.length; i++) {
            if (headerCells[i].tagName != 'TH') {
                return true;
            }
        }

        for (var i = 1; i < rows.length; i++) {
            if (rows[i].children[0].tagName != 'TH') {
                return true;
            }
        }
        return false;
    }

    axs.AuditRules.addRule({
        name: 'tableHasAppropriateHeaders',
        heading: 'Tables should have appropriate headers',
        url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_table_01',
        severity: axs.constants.Severity.SEVERE,
        relevantElementMatcher: function (element) {
            return axs.browserUtils.matchSelector(element, 'table');
        },
        test: function (element) {

            if (element.getAttribute('role') == 'presentation') {
                return element.querySelectorAll('th').length != 0;
            } else {
                var rows = element.querySelectorAll('tr');

                return tableDoesNotHaveHeaderRow(rows) &&
                    tableDoesNotHaveHeaderColumn(rows) &&
                    tableDoesNotHaveGridLayout(rows);
            }
        },
        code: 'AX_TABLE_01',
    });
})();
