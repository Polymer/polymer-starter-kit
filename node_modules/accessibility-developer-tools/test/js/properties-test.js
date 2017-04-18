module("Text Descendant", {
});

test("Find text descendants in an iframe.", function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var iframe = document.createElement('iframe');
    var html = '<body><div id="foo">bar</div></body>';
    fixture.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();

    var foo = iframe.contentDocument.getElementById("foo");

    equal(axs.properties.hasDirectTextDescendant(foo), true);
});

module('findTextAlternatives', {
    setup: function () {
        this.fixture_ = document.getElementById('qunit-fixture');
    }
});
test('returns the calculated text alternative for the given element', function() {
    var targetNode = document.createElement('select');
    this.fixture_.appendChild(targetNode);

    try {
        equal(axs.properties.findTextAlternatives(targetNode, {}, true), '');
    } catch(e) {
        ok(false, 'Threw exception');
    }
});
test('Image with no text alternative', function() {
    var fixture = document.getElementById('qunit-fixture');
    var img = fixture.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    var textAlternatives = {};
    axs.properties.findTextAlternatives(img, textAlternatives);
    equal(Object.keys(textAlternatives).length, 0, 'Image has no text alternative');
});

test('Image with alt text', function() {
    var fixture = document.getElementById('qunit-fixture');
    var img = fixture.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    img.alt = 'Smile!';
    var textAlternatives = {};
    axs.properties.findTextAlternatives(img, textAlternatives);
    equal(Object.keys(textAlternatives).length, 1, 'exactly one text alternative');
    equal('alt' in textAlternatives, true, 'alt in textAlternatives');
    equal('Smile!', textAlternatives.alt.text);
});

test('Input type image with alt text', function() {
    var fixture = document.getElementById('qunit-fixture');
    var img = fixture.appendChild(document.createElement('input'));
    img.type = "image";
    img.src = 'smile.jpg';
    img.alt = 'Smile!';
    var textAlternatives = {};
    axs.properties.findTextAlternatives(img, textAlternatives);
    equal(Object.keys(textAlternatives).length, 1, 'exactly one text alternative');
    equal('alt' in textAlternatives, true, 'alt in textAlternatives');
    equal('Smile!', textAlternatives.alt.text);
});

test('Image with aria label', function() {
    var fixture = document.getElementById('qunit-fixture');
    var img = fixture.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    img.setAttribute('aria-label', 'Smile!');
    var textAlternatives = {};
    axs.properties.findTextAlternatives(img, textAlternatives);
    equal(Object.keys(textAlternatives).length, 1, 'exactly one text alternative');
    equal('ariaLabel' in textAlternatives, true, 'ariaLabel in textAlternatives');
    equal('Smile!', textAlternatives.ariaLabel.text);
});

test('Image with aria labelledby', function() {
    var fixture = document.getElementById('qunit-fixture');
    var img = fixture.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    var label = fixture.appendChild(document.createElement('div'));
    label.textContent = 'Smile!';
    label.id = 'label';
    img.setAttribute('aria-labelledby', 'label');
    var textAlternatives = {};
    axs.properties.findTextAlternatives(img, textAlternatives);
    equal(Object.keys(textAlternatives).length, 1, 'exactly one text alternative');
    equal('ariaLabelledby' in textAlternatives, true, 'ariaLabelledby in textAlternatives');
    equal('Smile!', textAlternatives.ariaLabelledby.text);
});

test('Image with title', function() {
    var fixture = document.getElementById('qunit-fixture');
    var img = fixture.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    img.setAttribute('title', 'Smile!');
    var textAlternatives = {};
    axs.properties.findTextAlternatives(img, textAlternatives);
    equal(Object.keys(textAlternatives).length, 1, 'exactly one text alternative');
    equal('title' in textAlternatives, true, 'title in textAlternatives');
    equal('Smile!', textAlternatives.title.text);
});


test('Link with aria-hidden text', function() {
    var fixture = document.getElementById('qunit-fixture');
    var anchor = fixture.appendChild(document.createElement('a'));
    anchor.href = '#';
    anchor.innerHTML = '<span aria-hidden="true">X</span><span>Close this window</span>';
    var textAlternatives = {};
    var result = axs.properties.findTextAlternatives(anchor, textAlternatives);
    equal(Object.keys(textAlternatives).length, 1, 'exactly one text alternative');
    equal('content' in textAlternatives, true, 'content in textAlternatives');
    equal(textAlternatives.content.text, 'Close this window');
    equal(result, 'Close this window');
});

test('Link with aria-labelledby aria-hidden text', function() {
    var fixture = document.getElementById('qunit-fixture');
    var anchor = fixture.appendChild(document.createElement('a'));
    anchor.href = '#';
    anchor.setAttribute('aria-labelledby', 'foobar');
    anchor.innerHTML = '<span id="foobar" aria-hidden="true">X</span><span>Close this window</span>';
    var textAlternatives = {};
    var result = axs.properties.findTextAlternatives(anchor, textAlternatives);
    equal(Object.keys(textAlternatives).length, 2, 'exactly two text alternatives');
    equal('ariaLabelledby' in textAlternatives, true, 'ariaLabelledby in textAlternatives');
    equal(textAlternatives.content.text, 'Close this window');
    equal(textAlternatives.ariaLabelledby.text, 'X');
    equal(result, 'X');
});

test('Link with aria-labelledby element with aria-label', function() {
    var fixture = document.getElementById('qunit-fixture');
    var anchor = fixture.appendChild(document.createElement('a'));
    anchor.href = '#';
    anchor.setAttribute('aria-labelledby', 'foobar');
    var label = fixture.appendChild(document.createElement('span'));
    label.setAttribute('id', 'foobar');
    label.setAttribute('aria-label', 'Learn more about trout fishing');
    var textAlternatives = {};
    var result = axs.properties.findTextAlternatives(anchor, textAlternatives);
    equal(Object.keys(textAlternatives).length, 1, 'exactly one text alternative');
    equal('ariaLabelledby' in textAlternatives, true, 'ariaLabelledby in textAlternatives');
    equal(textAlternatives.ariaLabelledby.text, 'Learn more about trout fishing');
    equal(result, 'Learn more about trout fishing');
});

module('getTextFromHostLanguageAttributes', {
    setup: function () {
        this.fixture_ = document.getElementById('qunit-fixture');
    }
});
test('does not crash when targetNode has a numeric id attribute', function() {
    var targetNode = document.createElement('input');
    targetNode.setAttribute('id', '123_user');
    this.fixture_.appendChild(targetNode);

    try {
        equal(axs.properties.getTextFromHostLanguageAttributes(targetNode, {}, null), null);
    } catch(e) {
        ok(false, 'Threw exception: ' + e);
    }
});

module('getFocusProperties', {});
test('Get focus properties', function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');
    fixture.style.top = 0;
    fixture.style.left = 0;

    var html = '<div id="overlapped" tabindex="0">Overlapped element</div>' +
               '<div id="overlapping" style="font-size: 48px; ' +
               'position: relative; top: -40px; height: 40px; ' +
               'background: rgba(255, 255, 255, 0.5);">Overlapping div</div>';
    fixture.innerHTML = html;

    var overlapped = document.getElementById('overlapped');
    var overlapping = document.getElementById('overlapping');

    var rect = overlapped.getBoundingClientRect();
    var center_x = (rect.left + rect.right) / 2;
    var center_y = (rect.top + rect.bottom) / 2;
    var elementAtPoint = document.elementFromPoint(center_x, center_y);

    var focusProperties = axs.properties.getFocusProperties(overlapped);
    if (elementAtPoint != null) {
        deepEqual(focusProperties,
                  { tabindex: { value: "0", valid: true },
                    visible: { value: false,
                               hidden: {
                                   value: false,
                                   valid: false
                               },
                               valid: false,
                               overlappingElements: [overlapping] } });
    } else {
        // This will occur if running in phantomjs.
        deepEqual(focusProperties,
                  { tabindex: { value: "0", valid: true },
                    visible: { value: true, valid: true } });
    }
});

module("getTextFromDescendantContent", {
    setup: function () {
        this.fixture_ = document.getElementById('qunit-fixture');
    }
});
test("returns text from the descendants of the element", function() {
    var html = '<label>\n' +
            '  <input type="radio" id="reason_Screenshot" name="reason" value="screenshot"></input>\n' +
            '</label>';
    this.fixture_.innerHTML = html;
    var targetNode = this.fixture_.querySelector('label');

    try {
        equal(axs.properties.getTextFromDescendantContent(targetNode), '');
        return ok(true);
    } catch(e) {
        return ok(false, 'Threw exception: ' + e);
    }
});

module('getImplicitRole', {
    setup: function() {}
});

test('get implicit role for button', function() {
    var element = document.createElement('button');
    var actual = axs.properties.getImplicitRole(element);
    equal(actual, 'button');
});

test('get implicit role for input type=button', function() {
    var element = document.createElement('input');
    element.setAttribute('type', 'button');
    var actual = axs.properties.getImplicitRole(element);
    equal(actual, 'button');
});

test('get implicit role for input type=range', function() {
    var element = document.createElement('input');
    element.setAttribute('type', 'range');
    var actual = axs.properties.getImplicitRole(element);
    equal(actual, 'slider');
});

test('get implicit role for li out of context', function() {
    var element = document.createElement('li');
    var actual = axs.properties.getImplicitRole(element);
    strictEqual(actual, '');
});

test('get implicit role for li child of ul', function() {
    var element = document.createElement('ul');
    element = element.appendChild(document.createElement('li'));
    var actual = axs.properties.getImplicitRole(element);
    equal(actual, 'listitem');
});

test('get implicit role for li descendant of ul', function() {
    var element = document.createElement('ul');
    element = element.appendChild(document.createElement('div'));  // bad html i know but good for test
    element = element.appendChild(document.createElement('li'));
    var actual = axs.properties.getImplicitRole(element);
    strictEqual(actual, '');
});

module('getTextProperties', {});
test('Image with no text alternative', function() {
    var fixture = document.getElementById('qunit-fixture');
    var img = fixture.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    var textProperties = axs.properties.getTextProperties(img);
    equal('alt' in textProperties, true, 'alt in textProperties');
    equal(textProperties.alt.valid, false, 'alt is not valid');
    equal('filename' in textProperties, true, 'filename in textProperties');
    equal(textProperties.filename.text, 'smile.jpg');
    equal('computedText' in textProperties, true, 'computedText in textProperties');
    equal(textProperties.computedText, 'smile.jpg');
});
