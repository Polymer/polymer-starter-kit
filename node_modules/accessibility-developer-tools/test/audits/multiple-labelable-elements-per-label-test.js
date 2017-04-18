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

module("multipleLabelableElementsPerLabel");

test("one labelable element within a label tag", function() {
  var fixture = document.getElementById("qunit-fixture");
  var label = document.createElement("label");
  var input = document.createElement("input");

  fixture.appendChild(label);
  label.appendChild(input);

  var rule = axs.AuditRules.getRule("multipleLabelableElementsPerLabel");
  var result = rule.run({ scope: fixture });
  var expected = {
    elements: [],
    result: axs.constants.AuditResult.PASS
  };

  deepEqual(result, expected, "passes the audit with no matching elements");
});

test("multiple labelable elements within a label tag", function() {
  var fixture = document.getElementById("qunit-fixture");
  var label = document.createElement("label");
  var input1 = document.createElement("input");
  var input2 = document.createElement("input");

  fixture.appendChild(label);
  label.appendChild(input1);
  label.appendChild(input2);

  var rule = axs.AuditRules.getRule("multipleLabelableElementsPerLabel");
  var result = rule.run({ scope: fixture });
  var expected = {
    elements: [label],
    result: axs.constants.AuditResult.FAIL
  };

  deepEqual(result, expected, "fails the audit on that label");
});
