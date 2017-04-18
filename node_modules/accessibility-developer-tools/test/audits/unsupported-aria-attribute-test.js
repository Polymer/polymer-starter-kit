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
(function() {
    module('UnupportedAriaAttribute');
    var rule = axs.AuditRules.getRule('unsupportedAriaAttribute');

    test('Element with role and global, supported and required attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('role', 'spinbutton');
        widget.setAttribute('aria-hidden', 'false');  // global
        widget.setAttribute('aria-required', 'true');  // supported
        widget.setAttribute('aria-valuemax', '79');  // required
        widget.setAttribute('aria-valuemin', '10');  // required
        widget.setAttribute('aria-valuenow', '50');  // required
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    test('Element with no role and global attributes only', function() {
        var fixture = document.getElementById('qunit-fixture');
        var div = fixture.appendChild(document.createElement('div'));
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        div.setAttribute('aria-hidden', 'false');  // global
        div.setAttribute('aria-label', 'bananas'); // global
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    /*
     * This rule shouldn't care if required and/or supported roles are missing.
     */
    test('Element with role and global but missing supported and required attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('role', 'spinbutton');
        widget.setAttribute('aria-hidden', 'false');  // global (so the audit will encounter this element)
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    test('Element with role and known but unsupported attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        var expected = { elements: [widget], result: axs.constants.AuditResult.FAIL };
        widget.setAttribute('role', 'group');
        widget.setAttribute('aria-required', 'true');  // unsupported
        widget.setAttribute('aria-valuemax', '79');  // unsupported
        widget.setAttribute('aria-valuemin', '10');  // unsupported
        widget.setAttribute('aria-valuenow', '50');  // unsupported
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    /*
     * This rule shouldn't care if we put ARIA attributes on elements that shouldn't have them.
     */
    test('Element with role and global but missing supported and required attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('meta'));  // note, a reserved HTML element
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('role', 'spinbutton');
        widget.setAttribute('aria-hidden', 'false');  // global (so the audit will encounter this element)
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    /*
     * This test shouldn't care if there are unknown aria- attributes.
     */
    test('Element with a role and unknown aria- attribute', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('role', 'spinbutton');
        widget.setAttribute('aria-labeledby', 'false');  // unknown
        widget.setAttribute('aria-hidden', 'false');  // global
        widget.setAttribute('aria-required', 'true');  // supported
        widget.setAttribute('aria-valuemax', '79');  // required
        widget.setAttribute('aria-valuemin', '10');  // required
        widget.setAttribute('aria-valuenow', '50');  // required
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    /*
     * This rule definitely needs to visit elements with no role attribute.
     */
    test('Element with no role and unknown aria- attribute', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('aria-required', 'true');  // unsupported
        var expected = { elements: [widget], result: axs.constants.AuditResult.FAIL };
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    /*
     * This rule can ignore elements with no aria- attributes.
     */
    test('Element with role but no aria- attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'spinbutton');
        var expected = { result: axs.constants.AuditResult.NA };
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    /*
     * This rule can ignore elements with only unknown aria- attributes.
     */
    test('Element with role but no aria- attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'spinbutton');
        widget.setAttribute('aria-cucumber', 'true');  // unknown
        var expected = { result: axs.constants.AuditResult.NA };
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    test('Element with no role and some global, some unsupported aria- attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('aria-busy', 'false');  // global
        widget.setAttribute('aria-hidden', 'false');  // global
        widget.setAttribute('aria-posinset', '10');  // unsupported
        var expected = { elements: [widget], result: axs.constants.AuditResult.FAIL };
        deepEqual(rule.run({ scope: fixture }), expected);
    });

	test('Element with no role and global aria- attributes', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('input'));
        widget.type = "text";
        widget.setAttribute('aria-label', 'This is my label');  // global
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected);
    });

    test('Input with no type attribute with no role and aria-required', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('input'));
        widget.setAttribute('aria-required', 'true');
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'An input with no type is a textbox');
    });

    test('Input with type=text attribute with no role and aria-required', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('input'));
        widget.setAttribute('type', 'text');
        widget.setAttribute('aria-required', 'true');
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'A text input is a textbox');
    });

    test('Input with type=text property with no role and aria-required', function() {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('input'));
        widget.type = 'text';
        widget.setAttribute('aria-required', 'true');
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'A text input is a textbox');
    });
})();
