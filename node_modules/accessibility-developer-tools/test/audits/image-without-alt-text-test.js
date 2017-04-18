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
    module('ImageWithoutAltText');
    var rule = axs.AuditRules.getRule('imagesWithoutAltText');

    test('Image with no text alternative', function() {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        var expected = { elements: [img], result: axs.constants.AuditResult.FAIL };
        deepEqual(rule.run({ scope: fixture }), expected, 'Image has no text alternative');
    });

    test('Image with no text alternative and presentational role', function() {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.setAttribute('role', 'presentation');
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'Image has presentational role');
    });

    test('Image with alt text', function() {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.alt = 'Smile!';
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'Image has alt text');
    });

    test('Image with empty alt text', function() {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.alt = '';
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'Image has empty alt text');
    });

    test('Image with aria label', function() {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.setAttribute('aria-label', 'Smile!');
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'Image has aria label');
    });

    test('Image with aria labelledby', function() {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        var label = fixture.appendChild(document.createElement('div'));
        label.textContent = 'Smile!';
        label.id = 'label';
        img.setAttribute('aria-labelledby', 'label');
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'Image has aria labelledby');
    });

    test('Image with title', function() {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.setAttribute('title', 'Smile!');
        var expected = { elements: [], result: axs.constants.AuditResult.PASS };
        deepEqual(rule.run({ scope: fixture }), expected, 'Image has title');
    });
})();
