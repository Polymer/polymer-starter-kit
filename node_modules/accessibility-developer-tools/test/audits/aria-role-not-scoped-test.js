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
module('AriaRoleNotScoped');

test('Scope role present', function() {
    var rule = axs.AuditRules.getRule('ariaRoleNotScoped');
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

test('Scope role implicitly present', function() {
    /*
     * The HTML + ARIA here is not necessarily good - it is built to facilitate testing, nothing else.
     */
    var rule = axs.AuditRules.getRule('ariaRoleNotScoped');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('ol'));
    for (var i = 0; i < 4; i++) {
        var item = container.appendChild(document.createElement('span'));
        item.setAttribute('role', 'listitem');
    }

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Scope role present via aria-owns', function() {
    var rule = axs.AuditRules.getRule('ariaRoleNotScoped');
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
    equal(container.childNodes.length, 0, 'container should have no child nodes since we\'re checking use of aria-owns');  // paranoid check to ensure the test itself is correct
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Scope role missing', function() {
    var rule = axs.AuditRules.getRule('ariaRoleNotScoped');
    var fixture = document.getElementById('qunit-fixture');
    var expected = [];
    for (var i = 0; i < 4; i++) {
        var item = fixture.appendChild(document.createElement('span'));
        item.setAttribute('role', 'listitem');
        expected.push(item);
    }

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, expected);
});

test('Scope role present - tablist', function() {
    var rule = axs.AuditRules.getRule('ariaRoleNotScoped');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('ul'));
    container.setAttribute('role', 'tablist');
    for (var i = 0; i < 4; i++) {
        var item = container.appendChild(document.createElement('li'));
        item.setAttribute('role', 'tab');
    }

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Scope role missing - tab', function() {
    var rule = axs.AuditRules.getRule('ariaRoleNotScoped');
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('ul'));
    var expected = [];
    for (var i = 0; i < 4; i++) {
        var item = container.appendChild(document.createElement('li'));
        item.setAttribute('role', 'tab');
        expected.push(item);
    }

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, expected);
});
