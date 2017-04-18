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
module('DuplicateId');

test('No duplicate ID, no used IDREF', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');

    var element2 = fixture.appendChild(document.createElement('div'));
    element2.setAttribute('id', 'fukung');

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA);
});

test('No duplicate ID with IDREF', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('input'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    element2.setAttribute('id', 'kungfutoo');
    fixture.appendChild(document.createElement('label')).setAttribute('for', element.id);
    fixture.appendChild(document.createElement('label')).setAttribute('for', element2.id);

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Single duplicate ID, not used', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');
    fixture.appendChild(element.cloneNode());

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA);
});

test('Single unused duplicate ID but it\'s in shadow DOM', function() {
    // Perhaps this test is overly paranoid...
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');
    if (!fixture.createShadowRoot) {
        expect(0);  // even Chrome (36 on Mac) seems to end up here...
        return false;
    }

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');

    var element2 = fixture.appendChild(document.createElement('div'));
    var shadowRoot = element2.createShadowRoot();
    shadowRoot.appendChild(element.cloneNode());

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA);
});

test('Single used duplicate ID but it\'s in shadow DOM', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');
    if (!fixture.createShadowRoot) {
        expect(0);  // even Chrome (36 on Mac) seems to end up here...
        return false;
    }

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');
    var referrer = document.createElement('span');
    referrer.setAttribute('aria-labelledby', element.id);
    fixture.appendChild(referrer);

    var element2 = fixture.appendChild(document.createElement('div'));
    var shadowRoot = element2.createShadowRoot();
    shadowRoot.appendChild(element.cloneNode());

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
});

test('Single duplicate ID, used in html idref', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('input'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    var referrer = fixture.appendChild(document.createElement('label'));
    referrer.setAttribute('for', element.id);

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [element, element2]);

    referrer.setAttribute('aria-hidden', 'true');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'aria-hidden elements should be ignored');
    referrer.removeAttribute('aria-hidden');

    referrer.setAttribute('hidden', 'hidden');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'hidden elements should be ignored');

});

test('Single duplicate ID, used in html idrefs', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('input'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    var element3 = fixture.appendChild(document.createElement('input'));
    element3.setAttribute('id', 'el3');
    var idrefs = element3.id + ' ' + element.id;
    var referrer = fixture.appendChild(document.createElement('output'));
    referrer.setAttribute('for', idrefs);

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [element, element2]);

    referrer.setAttribute('aria-hidden', 'true');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'aria-hidden elements should be ignored');
    referrer.removeAttribute('aria-hidden');

    referrer.setAttribute('hidden', 'hidden');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'hidden elements should be ignored');
});

test('Single duplicate ID, used in ARIA idref', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    var element = container.appendChild(document.createElement('span'));
    element.setAttribute('id', 'kungfu');
    var element2 = container.appendChild(element.cloneNode());
    container.setAttribute('aria-activedescendant', element.id);

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [element, element2]);

    container.setAttribute('aria-hidden', 'true');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'aria-hidden elements should be ignored');
    container.removeAttribute('aria-hidden');

    container.setAttribute('hidden', 'hidden');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'hidden elements should be ignored');

});

test('Single duplicate ID, used in ARIA idrefs', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    var element = fixture.appendChild(document.createElement('span'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    var element3 = fixture.appendChild(document.createElement('input'));
    element3.setAttribute('id', 'el3');
    var idrefs = element3.id + ' ' + element.id;
    container.setAttribute('aria-owns', idrefs);

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [element, element2]);

    container.setAttribute('aria-hidden', 'true');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'aria-hidden elements should be ignored');
    container.removeAttribute('aria-hidden');

    container.setAttribute('hidden', 'hidden');
    actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA, 'hidden elements should be ignored');
});
