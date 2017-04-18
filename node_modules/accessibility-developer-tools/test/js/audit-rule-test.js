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
(function(){
    module("collectMatchingElements");

    var DIV_COUNT = 10;
    function matcher(element) {
        var tagName = element.tagName;
        if (!tagName)
            return false;
        return (tagName.toLowerCase() === "div" && element.classList.contains("test"));
    }

    function buildTestDom() {
        var result = document.createDocumentFragment();
        result = result.appendChild(document.createElement("div"));
        for (var i = 0; i < DIV_COUNT; i++) {
            var element = document.createElement("div");
            element.className = "test";
            element.id = "test-" + i;
            result.appendChild(element);
        }
        return result;
    }

    test("Simple DOM", function () {
        var container = document.getElementById('qunit-fixture');
        container.appendChild(buildTestDom());
        var matched = [];
        axs.AuditRule.collectMatchingElements(container, matcher, matched);
        equal(matched.length, DIV_COUNT);
    });

    test("Simple DOM with an ignored selector", function () {
        var container = document.getElementById('qunit-fixture');
        container.appendChild(buildTestDom());
        var fooElement = document.createElement('div');
        fooElement.className = 'foo';
        container.appendChild(fooElement);
        var fooTest = document.createElement('div');
        fooTest.className = 'test';
        fooElement.appendChild(fooTest);
        var matched = [];
        var ignoredSelectors = ['.foo'];
        axs.AuditRule.collectMatchingElements(container, matcher, matched, ignoredSelectors);
        equal(matched.length, DIV_COUNT);
    });

    test("With shadow DOM with no content insertion point", function () {
        var container = document.getElementById('qunit-fixture');
        container.appendChild(buildTestDom());
        var wrapper = container.firstElementChild;
        if (wrapper.createShadowRoot) {
            var matched = [];
            var root = wrapper.createShadowRoot();
            axs.AuditRule.collectMatchingElements(wrapper, matcher, matched);
            equal(matched.length, 0);
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });

    test("With shadow DOM with content element", function () {
        var container = document.getElementById('qunit-fixture');
        container.appendChild(buildTestDom());
        var wrapper = container.firstElementChild;
        if (wrapper.createShadowRoot) {
            var matched = [];
            var root = wrapper.createShadowRoot();
            var content = document.createElement('content');
            root.appendChild(content);
            axs.AuditRule.collectMatchingElements(wrapper, matcher, matched);
            // <content> picks up content
            equal(matched.length, DIV_COUNT);
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });

    test("Nodes within shadow DOM", function () {
        var container = document.getElementById('qunit-fixture');
        var wrapper = container.appendChild(document.createElement("div"));
        if (wrapper.createShadowRoot) {
            var root = wrapper.createShadowRoot();
            root.appendChild(buildTestDom());
            var matched = [];
            axs.AuditRule.collectMatchingElements(container, matcher, matched);
            // Nodes in shadows are found
            equal(matched.length, DIV_COUNT);
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });

    test("Nodes within DOM and shadow DOM - no content distribution point", function () {
        var container = document.getElementById('qunit-fixture');
        var wrapper = container.appendChild(document.createElement("div"));
        if (wrapper.createShadowRoot) {
            var root = wrapper.createShadowRoot();
            var rootContent = document.createElement('div');
            rootContent.className = 'test';
            root.appendChild(rootContent);
            wrapper.appendChild(buildTestDom());
            var matched = [];
            axs.AuditRule.collectMatchingElements(container, matcher, matched);
            // Nodes in light dom are not distributed
            equal(matched.length, 1);
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });

    test("Nodes within DOM and shadow DOM with content element", function () {
        var container = document.getElementById('qunit-fixture');
        var wrapper = container.appendChild(document.createElement("div"));
        wrapper.appendChild(buildTestDom());
        if (wrapper.createShadowRoot) {
            var root = wrapper.createShadowRoot();
            var rootContent = document.createElement('div');
            rootContent.className = 'test';
            root.appendChild(rootContent);
            var content = document.createElement('content');
            root.appendChild(content);
            var matched = [];
            axs.AuditRule.collectMatchingElements(container, matcher, matched);
            // Nodes in light dom are distributed into content element.
            equal(matched.length, (DIV_COUNT + 1));
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });
})();
