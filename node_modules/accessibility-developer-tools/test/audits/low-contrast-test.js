module('LowContrast');

test('No text = no relevant elements', function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = 'white';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA }
  );
});

test('Black on white = no problem', function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = 'black';
  div.textContent = 'Some text';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test('Low contrast = fail', function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = '#aaa';  // Contrast ratio = 2.32
  div.textContent = 'Some text';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [div], result: axs.constants.AuditResult.FAIL }
  );
});

test('Opacity is handled', function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var elementWithOpacity = document.createElement('div');
  elementWithOpacity.style.opacity = '0.4';
  elementWithOpacity.textContent = 'Some text';
  fixture.appendChild(elementWithOpacity);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [elementWithOpacity], result: axs.constants.AuditResult.FAIL }
  );
});

test('Uses tolerance value', function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = '#777'; // Contrast ratio = 4.48
  div.textContent = 'Some text';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test('Disabled button = no relevant elements', function() {
  var fixture = document.getElementById('qunit-fixture');
  var button = document.createElement('button');
  button.textContent = 'I Can Has Cheezburger?';
  button.setAttribute('disabled', 'disabled');
  fixture.appendChild(button);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test('aria-disabled button = no relevant elements', function() {
  var fixture = document.getElementById('qunit-fixture');
  var button = document.createElement('button');
  button.textContent = 'I Can Has Cheezburger?';
  button.setAttribute('aria-disabled', 'true');
  fixture.appendChild(button);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test('aria-disabled=false button = pass', function() {
  var fixture = document.getElementById('qunit-fixture');
  var button = document.createElement('button');
  button.textContent = 'I Can Has Cheezburger?';
  button.setAttribute('aria-disabled', 'false');
  fixture.appendChild(button);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS });
});

test('Button in disabled fieldset = no relevant elements', function() {
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('fieldset');
  container.setAttribute('disabled', 'disabled');
  var button = container.appendChild(document.createElement('button'));
  button.textContent = 'I Can Has Cheezburger?';
  fixture.appendChild(container);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test('Button in disabled=false fieldset = no relevant elements', function() {
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('fieldset');
  container.setAttribute('disabled', 'false');  // check that the value of disabled is irrelevant
  var button = container.appendChild(document.createElement('button'));
  button.textContent = 'I Can Has Cheezburger?';
  fixture.appendChild(container);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test('Button in aria-disabled container = no relevant elements', function() {
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('div');
  container.setAttribute('role', 'group');
  container.setAttribute('aria-disabled', 'true');
  var legend = container.appendChild(document.createElement('legend'));
  legend.textContent = 'I am Legend';
  var button = container.appendChild(document.createElement('button'));
  button.textContent = 'I Can Has Cheezburger?';
  fixture.appendChild(container);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test('Crazy button in disabled fieldset legend test = relevant elements', function() {
  /*
   * Test this bit of the spec:
   * The disabled attribute, when specified, causes all the form control descendants of the fieldset element,
   * excluding those that are descendants of the fieldset element's first legend element child, if any,
   * to be disabled.
   * @see http://www.w3.org/TR/html5/forms.html#attr-fieldset-disabled
   */
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('fieldset');
  container.setAttribute('disabled', 'disabled');
  var legend = container.appendChild(document.createElement('legend'));
  var button = legend.appendChild(document.createElement('button'));
  button.textContent = 'I Can Has Cheezburger?';
  fixture.appendChild(container);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS });
});

test('Even crazier button in disabled fieldset second legend test = no relevant elements', function() {
  /*
   * Test this bit of the spec:
   * The disabled attribute, when specified, causes all the form control descendants of the fieldset element,
   * excluding those that are descendants of the fieldset element's first legend element child, if any,
   * to be disabled.
   * @see http://www.w3.org/TR/html5/forms.html#attr-fieldset-disabled
   */
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('fieldset');
  container.setAttribute('disabled', 'disabled');
  var legend = container.appendChild(document.createElement('legend'));
  legend = container.appendChild(document.createElement('legend'));
  var button = legend.appendChild(document.createElement('button'));
  button.textContent = 'I Can Has Cheezburger?';
  fixture.appendChild(container);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test('Low contrast, disabled on undisableable = fail', function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('disabled', 'disabled');
  div.setAttribute('role', 'checkbox');
  div.tabIndex = 0;
  div.disabled = true;
  div.style.backgroundColor = 'white';
  div.style.color = 'white';
  div.textContent = 'Some text';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [div], result: axs.constants.AuditResult.FAIL }
  );
});
