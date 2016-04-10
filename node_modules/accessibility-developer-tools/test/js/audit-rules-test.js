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

(function(){

    module("axs.AuditRules.getRules");

    function buildDummySpec() {
        var dummySpec = {
            name: 'dummySpec',
            heading: 'This is a dummy spec',
            url: '',
            severity: axs.constants.Severity.WARNING,
            relevantElementMatcher: function() {
                throw new Error('This should never be called');
            },
            test: function() {
                throw new Error('This should never be called');
            },
            code: 'AX_DUMMY_01'
        };
        return dummySpec;
    }
    

    test("Get all registered rules", function () {
        var rules = axs.AuditRules.getRules();
        notEqual(rules.length, 0, 'Nothing to test!');
        for (var i = 0; i < rules.length; i++) {
            ok(rules[i] instanceof axs.AuditRule);
        }
    });

    test("Get all registered rule names", function () {
        var rules = axs.AuditRules.getRules();
        notEqual(rules.length, 0, 'Nothing to test!');
        var names = axs.AuditRules.getRules(true);
        equal(rules.length, names.length, 'A name for every rule and a rule for every name!');
        for (var i = 0; i < rules.length; i++) {
            equal(rules[i].name, names[i]);
        }
    });

    module("axs.AuditRules.getRule");

    test("Attempt to register a rule with a duplicate name", function () {
        var rules = axs.AuditRules.getRules();
        notEqual(rules.length, 0, 'Nothing to test!');
        for (var i = 0; i < rules.length; i++) {
            var rule = axs.AuditRules.getRule(rules[0].name);
            strictEqual(rules[0], rule);
        }
    });

    module("axs.AuditRules.addRule");

    test("Attempt to add a rule with a duplicate name", function () {
        var rules = axs.AuditRules.getRules();
        var ruleCount = rules.length;
        notEqual(ruleCount, 0, 'Nothing to test!');
        var ruleBefore = axs.AuditRules.getRule(rules[0].name);
        var spec = buildDummySpec();
        spec.name = ruleBefore.name;
        raises(function() {
            axs.AuditRules.addRule(spec);
        }, "An error should be thrown when trying to add a rule with duplicate name.");
        var ruleAfter = axs.AuditRules.getRule(ruleBefore.name);
        strictEqual(ruleBefore, ruleAfter, 'addRule should not have added a spec with a duplicate name');
        strictEqual(ruleCount, axs.AuditRules.getRules().length, 'rules collection should not have changed');
    });

    test("Attempt to add a rule with a duplicate code", function () {
        var rules = axs.AuditRules.getRules();
        var ruleCount = rules.length;
        notEqual(ruleCount, 0, 'Nothing to test!');
        var ruleBefore = axs.AuditRules.getRule(rules[0].name);
        var spec = buildDummySpec();
        spec.code = ruleBefore.code;
        raises(function() {
            axs.AuditRules.addRule(spec);
        }, "An error should be thrown when trying to add a rule with duplicate code.");
        var ruleAfter = axs.AuditRules.getRule(ruleBefore.name);
        strictEqual(ruleBefore, ruleAfter, 'addRule should not have added a spec with a duplicate code');
        strictEqual(ruleCount, axs.AuditRules.getRules().length, 'rules collection should not have changed');
    });
})();
