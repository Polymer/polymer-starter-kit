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

(function() {
    module('composedParentNode');

    test('No Shadow DOM', function() {
        var fixture = document.getElementById('qunit-fixture');
        var parent = fixture.appendChild(document.createElement('div'));
        parent.id = 'parent';
        var child = parent.appendChild(document.createElement('span'));
        child.id = 'child';
        equal(axs.dom.composedParentNode(child), parent);
        var textNode = child.appendChild(document.createTextNode('Hello, world!'));
        equal(axs.dom.composedParentNode(textNode), child);
    });

    test('Shadow root parent', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            equal(axs.dom.composedParentNode(root), host);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Distributed content parent', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var testElement = host.appendChild(document.createElement('span'));
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var content = document.createElement('content');
            root.appendChild(content);
            equal(axs.dom.composedParentNode(testElement), host);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Content not direct child of Shadow root', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var testElement = host.appendChild(document.createElement('span'));
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var shadowParent = root.appendChild(document.createElement('div'));
            shadowParent.id = 'shadowParent';
            var content = shadowParent.appendChild(document.createElement('content'));
            equal(axs.dom.composedParentNode(testElement), shadowParent);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Content reprojected', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var testElement = host.appendChild(document.createElement('span'));
        if (host.createShadowRoot) {
            var outerRoot = host.createShadowRoot();
            var shadowGrandparent = outerRoot.appendChild(document.createElement('div'));
            shadowGrandparent.id = 'shadowGrandparent';
            var outerContent = shadowGrandparent.appendChild(document.createElement('content'));
            var innerRoot = shadowGrandparent.createShadowRoot();
            var shadowParent = innerRoot.appendChild(document.createElement('div'));
            shadowParent.id = 'shadowParent';
            var innerContent = shadowParent.appendChild(document.createElement('content'));
            equal(axs.dom.composedParentNode(testElement), shadowParent);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Content not selected', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var testElement = host.appendChild(document.createElement('span'));
        testElement.id = 'test';
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var content = root.appendChild(document.createElement('content'));
            content.select = 'div';
            equal(axs.dom.composedParentNode(testElement), null);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Content selected', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var testElement = host.appendChild(document.createElement('span'));
        testElement.id = 'test';
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var content1 = root.appendChild(document.createElement('content'));
            content1.select = 'div';
            var content2 = root.appendChild(document.createElement('content'));
            content2.select = '#test';

            equal(axs.dom.composedParentNode(testElement), host);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Content selected, content not direct child of shadow host', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var testElement = host.appendChild(document.createElement('span'));
        testElement.id = 'test';
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var shadowParent = root.appendChild(document.createElement('div'));
            shadowParent.id = 'shadowParent';
            var content1 = root.appendChild(document.createElement('content'));
            content1.select = 'div';
            var content2 = shadowParent.appendChild(document.createElement('content'));
            content2.select = '#test';

            equal(axs.dom.composedParentNode(testElement), shadowParent);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Nodes within shadow DOM parent', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var shadowChild = root.appendChild(document.createElement('div'));
            equal(axs.dom.composedParentNode(shadowChild), host);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Nodes within DOM and shadow DOM - no content distribution point', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var lightChild = host.appendChild(document.createElement('span'));
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var shadowChild = root.appendChild(document.createElement('div'));
            shadowChild.id = 'shadowChild';
            equal(axs.dom.composedParentNode(lightChild), null);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });

    test('Nodes within DOM and shadow DOM with content element', function() {
        var fixture = document.getElementById('qunit-fixture');
        var host = fixture.appendChild(document.createElement('div'));
        host.id = 'host';
        var lightChild = host.appendChild(document.createElement('div'));
        if (host.createShadowRoot) {
            var root = host.createShadowRoot();
            var shadowChild = document.createElement('div');
            shadowChild.id = 'shadowChild';
            root.appendChild(shadowChild);
            var content = document.createElement('content');
            root.appendChild(content);
            equal(axs.dom.composedParentNode(lightChild), host);
        } else {
            console.warn('Test platform does not support shadow DOM');
            ok(true);
        }
    });
})();
