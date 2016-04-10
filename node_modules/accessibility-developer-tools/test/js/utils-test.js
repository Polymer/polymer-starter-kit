// Copyright 2012 Google Inc.
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

module("Zero Area", {
  setup: function () {
    var fixture = document.createElement('div');
    document.getElementById('qunit-fixture').appendChild(fixture);
    this.fixture_ = fixture;
  }
});
test("Large element has non-zero area.", function () {
  this.fixture_.style.display = "block";
  this.fixture_.style.width = "500px";
  this.fixture_.style.height = "500px";
  equal(axs.utils.elementHasZeroArea(this.fixture_), false);
});
test("Small element has non-zero area.", function () {
  this.fixture_.style.display = "block";
  this.fixture_.style.width = "1px";
  this.fixture_.style.height = "1px";
  equal(axs.utils.elementHasZeroArea(this.fixture_), false);
});
test("Empty element has zero area.", function () {
  equal(axs.utils.elementHasZeroArea(this.fixture_), true);
});
test("Inline element has non-zero area.", function () {
  this.fixture_.style.display = "inline";
  this.fixture_.appendChild(document.createTextNode('Size!'));
  equal(axs.utils.elementHasZeroArea(this.fixture_), false);
});

module("Transparency", {
  setup: function () {
    var fixture = document.createElement('div');
    document.getElementById('qunit-fixture').appendChild(fixture);
    this.fixture_ = fixture;
  }
});
test("Transparent elements are transparent.", function () {
  this.fixture_.style.opacity = 0;
  equal(axs.utils.elementIsTransparent(this.fixture_), true);
});
test("Hidden, but opaque elements are not transparent.", function () {
  this.fixture_.style.display = 'none';
  this.fixture_.style.opacity = 1;
  equal(axs.utils.elementIsTransparent(this.fixture_), false);
});
test("Non-transparent elements are non-transparent.", function () {
  for (var i = 0.001; i <= 1; i += 0.001) {
    this.fixture_.style.opacity = i;
    equal(axs.utils.elementIsTransparent(this.fixture_), false);
  }
});

module("Control labels", {
  setup: function () {
  }
});
test("Input type=submit has a label.", function() {
  var element = document.createElement("input");
  element.type = "submit";
  equal(axs.utils.hasLabel(element), true);
});
test("A placeholder does not count as a label.", function() {
  var element0 = document.createElement("textarea");
  element0.placeholder = "Your life story";
  equal(axs.utils.hasLabel(element0), false);

  var element1 = document.createElement("input");
  element1.placeholder = "First name";
  equal(axs.utils.hasLabel(element1), false);

  var element2 = document.createElement("input");
  element2.type = "url";
  element2.placeholder = "Homepage";
  equal(axs.utils.hasLabel(element2), false);
});
test('axs.utils.hasLabel() does not crash for element with numeric id attribute', function() {
    var element = document.createElement('input');
    element.setAttribute('id', '123_user');

    try {
        equal(axs.utils.hasLabel(element), false);
    } catch(e) {
        ok(false, 'Threw exception: ' + e);
    }
});

module("getQuerySelectorText", {
  setup: function () {
    this.fixture_ = document.getElementById('qunit-fixture');
  }
});
test("returns the selector text for a nested object with a class attribute", function() {
  var targetNode = document.createElement('em');
  targetNode.setAttribute('class', 'foo');
  var targetParentNode = document.createElement('p');
  targetParentNode.appendChild(targetNode);
  this.fixture_.appendChild(targetParentNode);

  equal(axs.utils.getQuerySelectorText(targetNode), "#qunit-fixture > P > .foo");
});
test("nth-of-type does not refer to a selector but a tagName", function() {
  var html = '<ul><li>One</li><li class="thing">Two</li><li class="thing">Three</li></ul>';
  this.fixture_.innerHTML = html;

  var lis = document.querySelectorAll('li');
  var lastLi = lis[lis.length - 1];
  var selector = axs.utils.getQuerySelectorText(lastLi);
  equal(lastLi, document.querySelector(selector),
        'selector "' + selector + '" does not match element');
});

module("getIdReferrers", {
  setup: function () {
    this.fixture_ = document.getElementById('qunit-fixture');
  }
});
test("returns the aria owners for a given element", function() {
  var owned = document.createElement("div");
  var ownerCount = 5;
  owned.id = "theOwned";
  this.fixture_.appendChild(owned);
  for(var i = 0; i < ownerCount; i++) {
    var owner = document.createElement("div");
    owner.setAttribute("aria-owns", "theOwned");
    owner.setAttribute("class", "owner");
    this.fixture_.appendChild(owner);
  }
  var expected = this.fixture_.querySelectorAll(".owner");
  var actual = axs.utils.getAriaIdReferrers(owned, "aria-owns");
  equal(expected.length, ownerCount);  // sanity check the test itself
  equal(actual.length, ownerCount);
  var allFound = Array.prototype.every.call(expected, function(element) {
      return (Array.prototype.indexOf.call(actual, element) >= 0);
  });
  equal(allFound, true);
});
test("returns the elements this element labels", function() {
  var label = document.createElement("div");
  var labelledCount = 2;
  label.id = "theLabel";
  this.fixture_.appendChild(label);
  for(var i = 0; i < labelledCount; i++) {
    var labelled = document.createElement("div");
    labelled.setAttribute("aria-labelledby", "theLabel notPresentInDom");
    labelled.setAttribute("class", "labelled");
    this.fixture_.appendChild(labelled);
  }
  var expected = this.fixture_.querySelectorAll(".labelled");
  var actual = axs.utils.getAriaIdReferrers(label, "aria-labelledby");
  equal(expected.length, labelledCount);  // sanity check the test itself
  equal(actual.length, labelledCount);
  var allFound = Array.prototype.every.call(expected, function(element) {
      return (Array.prototype.indexOf.call(actual, element) >= 0);
  });
  equal(allFound, true);
});
module("getAriaPropertiesByValueType", {
  setup: function () {

  }
});
test("Returns idref and idref_list types.", function() {
  var expected = ["activedescendant", "controls", "describedby", "flowto", "labelledby", "owns"];
  var actual = axs.utils.getAriaPropertiesByValueType(["idref", "idref_list"]);
  actual = Object.keys(actual);
  actual.sort();
  deepEqual(actual, expected);
});
test("Returns idref types.", function() {
  var expected = ["activedescendant"];
  var actual = axs.utils.getAriaPropertiesByValueType(["idref"]);
  actual = Object.keys(actual);
  actual.sort();
  deepEqual(actual, expected);
});

module("getSelectorForAriaProperties", {
  setup: function () {

  }
});
test("Returns a selector to match all aria properties.", function() {
  var expected = "[aria-activedescendant],[aria-atomic],[aria-autocomplete],[aria-busy],[aria-checked],[aria-controls],";
  expected += "[aria-describedby],[aria-disabled],[aria-dropeffect],[aria-expanded],[aria-flowto],[aria-grabbed],";
  expected += "[aria-haspopup],[aria-hidden],[aria-invalid],[aria-label],[aria-labelledby],[aria-level],[aria-live],";
  expected += "[aria-multiline],[aria-multiselectable],[aria-orientation],[aria-owns],[aria-posinset],[aria-pressed],";
  expected += "[aria-readonly],[aria-relevant],[aria-required],[aria-selected],[aria-setsize],[aria-sort],[aria-valuemax],";
  expected += "[aria-valuemin],[aria-valuenow],[aria-valuetext]";
  var actual = axs.utils.getSelectorForAriaProperties(axs.constants.ARIA_PROPERTIES);
  deepEqual(actual, expected);
});
test("Returns a selector to match all aria idref properties.", function() {
  var expected = "[aria-activedescendant]";
  var actual = axs.utils.getSelectorForAriaProperties(axs.utils.getAriaPropertiesByValueType(["idref"]));
  deepEqual(actual, expected);
});

module("getRoles", {
    setup: function () {}
});

test("getRoles on element with valid role.", function() {
    for (var role in axs.constants.ARIA_ROLES) {
        if (axs.constants.ARIA_ROLES.hasOwnProperty(role) && !axs.constants.ARIA_ROLES[role].abstract) {
            var appliedRole = { name: role, valid: true, details: axs.constants.ARIA_ROLES[role] };
            var expected = {
                valid: true,
                applied: appliedRole,
                roles: [appliedRole]
            };
            var element = document.createElement('div');
            element.setAttribute('role', role);
            var actual = axs.utils.getRoles(element);
            deepEqual(actual, expected);
        }
    }
});

test("getRoles on element with no role.", function() {
    var expected = null;
    var element = document.createElement('input');
    element.setAttribute('type', 'checkbox');
    var actual = axs.utils.getRoles(element);
    strictEqual(actual, expected);
});

test("getRoles on element with empty role.", function() {
    var expected = null;
    var element = document.createElement('div');
    element.setAttribute('role', '');
    var actual = axs.utils.getRoles(element);
    strictEqual(actual, expected);
});

test("getRoles on element with implicit role and options.implicit.", function() {
    var appliedRole = { name: 'checkbox', valid: true, details: axs.constants.ARIA_ROLES['checkbox'] };
    var expected = {
        valid: true,
        applied: appliedRole,
        roles: [appliedRole]
    };
    var element = document.createElement('input');
    element.setAttribute('type', 'checkbox');
    var actual = axs.utils.getRoles(element, { implicit: true });
    deepEqual(actual, expected);
});

test("getRoles on element with no role and options.implicit.", function() {
    var expected = null;
    var element = document.createElement('div');
    element.setAttribute('type', 'checkbox');  // invalid but let's put the pressure on
    var actual = axs.utils.getRoles(element, { implicit: true });
    strictEqual(actual, expected);
});

test("getRoles on element with abstract role.", function() {
    for (var role in axs.constants.ARIA_ROLES) {
        if (axs.constants.ARIA_ROLES.hasOwnProperty(role) && axs.constants.ARIA_ROLES[role].abstract) {
            var expected = {
                valid: false,
                roles: [{ name: role, valid: false }]
            };
            var element = document.createElement('div');
            element.setAttribute('role', role);
            var actual = axs.utils.getRoles(element);
            deepEqual(actual, expected);
        }
    }
});
(function() {
    /**
     * Creates a 'role detail' object which can be used for comparison in the assertions below.
     * @param {!string} role A potential ARIA role.
     * @return The 'role detail' object.
     */
    function createExpectedRoleObject(role) {
        var valid = (axs.constants.ARIA_ROLES.hasOwnProperty(role) && !axs.constants.ARIA_ROLES[role].abstract);
        var result = { name: role, valid: valid };
        if (valid) {
            result.details = axs.constants.ARIA_ROLES[role];
        }
        return result;
    }

    /**
     * Helper for multiple role tests.
     * @param {!Array<string>} roles Strings to set in the 'role' attribute of the element under test.
     * @param {!number} validIdx The index of the expected applied (valid) ARIA role in the array above
     *    or a negative number if there are no valid roles.
     * @return {Function} A test function for qunit.
     */
    function multipleRoleTestHelper(roles, validIdx) {
        return function() {
            var expectedRoles = roles.map(createExpectedRoleObject);
            var expected = {
                roles: expectedRoles
            };
            if (validIdx >= 0) {
                expected.valid = true;
                expected.applied = expectedRoles[validIdx];
            }
            else {
                expected.valid = false;
            }
            var element = document.createElement('div');
            element.setAttribute('role', roles.join(' '));
            var actual = axs.utils.getRoles(element);
            deepEqual(actual, expected);
        };
    }

    test("getRoles on element with multiple valid roles.", multipleRoleTestHelper(['checkbox', 'button', 'radio'], 0));
    test("getRoles on element with invalid and valid roles.", multipleRoleTestHelper(['foo', 'button', 'bar'], 1));
    test("getRoles on element with multiple invalid roles.", multipleRoleTestHelper(['foo', 'fubar', 'bar'], -1));

}());

module("isValidNumber");

test("with integer.", function() {
    var actual = axs.utils.isValidNumber("10");
    strictEqual(actual.value, 10, "Integer should be parsed");
    ok(actual.valid, "Integer should be valid");
});

test("with leading and trailing whitespace.", function() {
    var actual = axs.utils.isValidNumber(" 10 ");
    strictEqual(actual.value, 10, "Integer should be parsed");
    ok(actual.valid, "Integer should be valid");
});

test("with zero.", function() {
    var actual = axs.utils.isValidNumber("0");
    strictEqual(actual.value, 0, "Zero should be parsed");
    ok(actual.valid, "Integer should be valid");
});

test("with leading zero integer.", function() {
    var actual = axs.utils.isValidNumber("09");
    strictEqual(actual.value, 9, "Integer should be parsed");
    ok(actual.valid, "Integer should be valid");
});


test("with multiple leading zero integer.", function() {
    var actual = axs.utils.isValidNumber("000000009");
    strictEqual(actual.value, 9, "Integer should be parsed");
    ok(actual.valid, "Integer should be valid");
});

test("with leading zero positivie integer.", function() {
    var actual = axs.utils.isValidNumber("+09");
    strictEqual(actual.value, 9, "Integer should be parsed");
    ok(actual.valid, "Integer should be valid");
});

test("with leading zero negative integer.", function() {
    var actual = axs.utils.isValidNumber("-09");
    strictEqual(actual.value, -9, "Integer should be parsed");
    ok(actual.valid, "Integer should be valid");
});

test("with string starting with number.", function() {
    var actual = axs.utils.isValidNumber("10 foo");
    equal(actual.valid, false, "String that starts with a number is not valid");
    ok(actual.reason, "There should be a reason");
});

test("with true.", function() {
    var actual = axs.utils.isValidNumber("true");
    equal(actual.valid, false, "boolean is not valid");
    ok(actual.reason, "There should be a reason");
});

test("with true, leading and trailing space.", function() {
    var actual = axs.utils.isValidNumber(" true ");
    equal(actual.valid, false, "boolean is not valid");
    ok(actual.reason, "There should be a reason");
});

test("with false.", function() {
    var actual = axs.utils.isValidNumber("false");
    equal(actual.valid, false, "boolean is not valid");
    ok(actual.reason, "There should be a reason");
});

test("with hexadecimal.", function() {
    var actual = axs.utils.isValidNumber("0xF");
    equal(actual.valid, false, "Hexadecimal is not valid");
    ok(actual.reason, "There should be a reason");
});

test("with float.", function() {
    var actual = axs.utils.isValidNumber("0.5");
    strictEqual(actual.value, 0.5, "Float should be parsed");
    ok(actual.valid, "Float should be valid");
});

test("with float with no integer part.", function() {
    var actual = axs.utils.isValidNumber(".5");
    strictEqual(actual.value, .5, "Float should be parsed");
    ok(actual.valid, "Float should be valid");
});

test("with negative integer.", function() {
    var actual = axs.utils.isValidNumber("-100");
    strictEqual(actual.value, -100, "Negative should be parsed");
    ok(actual.valid, "Negative should be valid");
});

test("with negative float.", function() {
    var actual = axs.utils.isValidNumber("-1.5");
    strictEqual(actual.value, -1.5, "Negative should be parsed");
    ok(actual.valid, "Negative should be valid");
});

test("with positive integer.", function() {
    var actual = axs.utils.isValidNumber("+100");
    strictEqual(actual.value, 100, "Positive should be parsed");
    ok(actual.valid, "Positive should be valid");
});

test("with positive float.", function() {
    var actual = axs.utils.isValidNumber("+1.5");
    strictEqual(actual.value, 1.5, "Positive should be parsed");
    ok(actual.valid, "Positive should be valid");
});

test("with Infinity.", function() {
    var actual = axs.utils.isValidNumber("Infinity");
    equal(actual.valid, false, "Infinity is not a real number");
    ok(actual.reason, "There should be a reason");
});

test("with -Infinity.", function() {
    var actual = axs.utils.isValidNumber("-Infinity");
    equal(actual.valid, false, "-Infinity is not a real number");
    ok(actual.reason, "There should be a reason");
});

module('isElementDisabled', {
    setup: function () {
        var fixture = document.getElementById('qunit-fixture');
        var html = '<fieldset><legend>I am Legend<input/><span tabindex="0" role="checkbox"/></legend>';
        html += '<legend>I am Legend Too<input/><span tabindex="0" role="checkbox"/></legend>';
        html += '<input/><span tabindex="0" role="checkbox"/></fieldset>';
        fixture.innerHTML = html;
    }
});

test('nothing disabled', function() {
    var fixture = document.getElementById('qunit-fixture');
    var widget = fixture.querySelector('fieldset>input');
    strictEqual(axs.utils.isElementDisabled(widget), false);
});

test('form control natively disabled', function() {
    var fixture = document.getElementById('qunit-fixture');
    var widget = fixture.querySelector('fieldset>input');
    widget.setAttribute('disabled', 'false');  // also testing that disabled false is the same as disabled true
    strictEqual(axs.utils.isElementDisabled(widget), true);
});

test('form control aria-disabled', function() {
    var fixture = document.getElementById('qunit-fixture');
    var widget = fixture.querySelector('fieldset>input');
    widget.setAttribute('aria-disabled', 'true');
    strictEqual(axs.utils.isElementDisabled(widget), true);
});

test('form control aria-disabled false', function() {
    var fixture = document.getElementById('qunit-fixture');
    var widget = fixture.querySelector('fieldset>input');
    widget.setAttribute('aria-disabled', 'false');
    strictEqual(axs.utils.isElementDisabled(widget), false);
});

test('ARIA widget erroneously disabled', function() {
    var fixture = document.getElementById('qunit-fixture');
    var widget = fixture.querySelector('fieldset>[role]');
    widget.setAttribute('disabled', 'disabled');
    strictEqual(axs.utils.isElementDisabled(widget), false);
});

test('ARIA widget aria-disabled', function() {
    var fixture = document.getElementById('qunit-fixture');
    var widget = fixture.querySelector('fieldset>[role]');
    widget.setAttribute('aria-disabled', 'true');
    strictEqual(axs.utils.isElementDisabled(widget), true);
});

test('container natively disabled', function() {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.querySelector('fieldset');
    container.setAttribute('disabled', 'disabled');

    var widget = container.querySelector('fieldset>input');
    var actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, true, 'form control ');

    widget = container.querySelector('legend:first-of-type>input');
    actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, false, 'control in legend should not be disabled');

    widget = container.querySelector('legend:nth-of-type(2)>input');
    actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, true, 'control in 2nd legend should be disabled');

    widget = container.querySelector('fieldset>[role]');
    actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, false, 'ARIA widget should not be disabled');

    widget = container.querySelector('legend:first-of-type [role]');
    actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, false, 'ARIA widget in legend should not be disabled');

    widget = container.querySelector('legend:nth-of-type(2) [role]');
    actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, false, 'ARIA widget in 2nd legend should not be disabled');
});

(function() {
    test('container aria-disabled', function() {
        ariaDisabledOnContainerHelper(true);
    });

    test('container aria-disabled=false', function() {
        ariaDisabledOnContainerHelper(false);
    });

    function ariaDisabledOnContainerHelper(ariaDisabled) {
        var fixture = document.getElementById('qunit-fixture');
        var container = fixture.querySelector('fieldset');
        container.setAttribute('aria-disabled', ariaDisabled);

        var widget = container.querySelector('fieldset>input');
        var actual = axs.utils.isElementDisabled(widget);
        strictEqual(actual, ariaDisabled, 'form control');

        widget = container.querySelector('legend:first-of-type>input');
        actual = axs.utils.isElementDisabled(widget);
        strictEqual(actual, ariaDisabled, 'control in legend');

        widget = container.querySelector('legend:nth-of-type(2)>input');
        actual = axs.utils.isElementDisabled(widget);
        strictEqual(actual, ariaDisabled, 'control in 2nd legend');

        widget = container.querySelector('fieldset [role]');
        actual = axs.utils.isElementDisabled(widget);
        strictEqual(actual, ariaDisabled, 'ARIA widget');

        widget = container.querySelector('legend:first-of-type [role]');
        actual = axs.utils.isElementDisabled(widget);
        strictEqual(actual, ariaDisabled, 'ARIA widget in legend');

        widget = container.querySelector('legend:nth-of-type(2) [role]');
        actual = axs.utils.isElementDisabled(widget);
        strictEqual(actual, ariaDisabled, 'ARIA widget in 2nd legend');
    }
})();

test('first fieldset legend aria-disabled', function() {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.querySelector('legend:first-of-type');
    container.setAttribute('aria-disabled', 'true');

    var widget = container.querySelector('input');
    var actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, true, 'form control should be disabled');

    widget = container.querySelector('[role]');
    actual = axs.utils.isElementDisabled(widget);
    strictEqual(actual, true, 'ARIA widget should be disabled');
});
