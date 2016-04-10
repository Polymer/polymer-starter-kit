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
module('RequiredOwnedAriaRoleMissing');

test('Explicit role on container and required elements all explicitly present', function() {
    var rule = axs.AuditRules.getRule('requiredOwnedAriaRoleMissing');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'list');
    for (var i = 0; i < 4; i++) {
        var item = container.appendChild(document.createElement('span'));
        item.setAttribute('role', 'listitem');
    }

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Explicit role on container and required elements all explicitly present via aria-owns', function() {
    var rule = axs.AuditRules.getRule('requiredOwnedAriaRoleMissing');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    var siblingContainer = fixture.appendChild(document.createElement('div'));
    var ids = [];
    container.setAttribute('role', 'list');
    for (var i = 0; i < 4; i++) {
        var id = ids[i] = 'item' + i;
        var item = siblingContainer.appendChild(document.createElement('span'));
        item.setAttribute('role', 'listitem');
        item.setAttribute('id', id);
    }
    container.setAttribute('aria-owns', ids.join(' '));
    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
    equal(container.childNodes.length, 0);  // paranoid check to ensure the test itself is correct
});

test('Explicit role on container and required elements missing', function() {
    var rule = axs.AuditRules.getRule('requiredOwnedAriaRoleMissing');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'list');

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [container]);
});

test('Explicit role on aria-busy container and required elements missing', function() {
    var rule = axs.AuditRules.getRule('requiredOwnedAriaRoleMissing');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'list');
    container.setAttribute('aria-busy', 'true');

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});


test('Explicit role on container and required elements all implicitly present', function() {
    var rule = axs.AuditRules.getRule('requiredOwnedAriaRoleMissing');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('ul'));
    container.setAttribute('role', 'list');  // This is bad practice (redundant role) but that's a different test
    for (var i = 0; i < 4; i++) {
        container.appendChild(document.createElement('li'));
    }

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('No role', function() {
    var rule = axs.AuditRules.getRule('requiredOwnedAriaRoleMissing');
    var fixture = document.getElementById('qunit-fixture');
    fixture.appendChild(document.createElement('div'));

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA);
});

test('Role with no required elements', function() {
    var rule = axs.AuditRules.getRule('requiredOwnedAriaRoleMissing');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'checkbox');

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.NA);
});
